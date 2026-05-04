"""
Enrich Moroccan radio catalog from Radio-Browser API.

- Reads existing radios from public/radios.xlsx (manual canon).
- Fetches Morocco stations from de1.api.radio-browser.info.
- Filters: lastcheckok=1, decent bitrate, distinct name, ASCII-friendly.
- Tests stream reachability with HEAD/GET (short timeout).
- Downloads favicons to public/icons/ (best-effort, skips broken).
- Writes public/radios.json (canonical merged list).
"""

from __future__ import annotations

import json
import re
import socket
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ICONS = PUBLIC / "icons"
XLSX_PATH = PUBLIC / "radios.xlsx"
JSON_PATH = PUBLIC / "radios.json"
CACHE = ROOT / "scripts" / "_ma_radios.json"

UA = "radio-maroc/1.0 (https://github.com)"
API = "https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/MA"

socket.setdefaulttimeout(8)


def http_get(url: str, timeout: int = 8) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def load_existing_xlsx(path: Path) -> list[dict]:
    """Read radios.xlsx via raw zip parsing — no pandas/openpyxl needed."""
    radios: list[dict] = []
    with zipfile.ZipFile(path) as z:
        ss_xml = z.read("xl/sharedStrings.xml")
        sh_xml = z.read("xl/worksheets/sheet1.xml")
    ns = {"x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    sst = [t.text or "" for t in ET.fromstring(ss_xml).iter("{%s}t" % ns["x"])]
    sheet = ET.fromstring(sh_xml)
    for row in sheet.iter("{%s}row" % ns["x"]):
        cells = list(row.iter("{%s}c" % ns["x"]))
        if len(cells) < 2:
            continue
        name = ""
        url = ""
        for c in cells:
            ref = c.attrib.get("r", "")
            v = c.find("{%s}v" % ns["x"])
            if v is None:
                continue
            val = sst[int(v.text)] if c.attrib.get("t") == "s" else (v.text or "")
            col = re.sub(r"\d+$", "", ref)
            if col == "A":
                name = val.strip()
            elif col == "B":
                url = val.strip()
        if name and url and url.lower().startswith(("http://", "https://")):
            if name.lower() == "radio name" or url.lower() == "stream url":
                continue
            radios.append({"name": name, "url": url, "source": "manual"})
    return radios


def normalize_name(name: str) -> str:
    s = name.strip().lower()
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"\(.*?\)", "", s)
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


def looks_clean(name: str) -> bool:
    if not name or len(name) < 3:
        return False
    if not re.search(r"[A-Za-z]", name):
        return False
    arabic_only = re.fullmatch(r"[^A-Za-z]*", name)
    if arabic_only and not re.search(r"[A-Za-z]", name):
        return False
    bad_markers = ("\n", "\\", "?", "؟", "MRC:-", "MA:-", "test", "stream.zeno.fm")
    return not any(m in name for m in bad_markers if m != "stream.zeno.fm")


def title_case(name: str) -> str:
    name = re.sub(r"\s+", " ", name).strip()
    name = re.sub(r"\s*\([^)]*\)\s*", "", name).strip()
    parts = []
    for w in name.split(" "):
        if w.isupper() and len(w) > 3:
            parts.append(w.title())
        elif len(w) <= 3 and w.isalpha():
            parts.append(w.upper() if w.lower() in ("fm", "am", "dj", "ma") else w.title())
        else:
            parts.append(w[:1].upper() + w[1:])
    return " ".join(parts)


def fetch_candidates() -> list[dict]:
    if CACHE.exists():
        try:
            return json.loads(CACHE.read_text(encoding="utf-8"))
        except Exception:
            pass
    print("→ Fetching Radio-Browser API…")
    qs = urllib.parse.urlencode({
        "hidebroken": "true",
        "order": "clickcount",
        "reverse": "true",
        "limit": "120",
    })
    raw = http_get(f"{API}?{qs}")
    data = json.loads(raw)
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data


def stream_works(url: str) -> bool:
    """Best-effort: a few KB read with short timeout."""
    if not url or not url.startswith(("http://", "https://")):
        return False
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": UA,
            "Range": "bytes=0-2047",
            "Icy-MetaData": "0",
        })
        with urllib.request.urlopen(req, timeout=5) as r:
            ctype = (r.headers.get("Content-Type") or "").lower()
            data = r.read(2048)
            if not data:
                return False
            if any(k in ctype for k in ("audio", "ogg", "mpegurl", "x-mpegurl", "octet-stream", "video/mp2t")):
                return True
            if url.lower().endswith(".m3u8") and b"#EXT" in data[:64]:
                return True
            if ctype.startswith("text/"):
                return False
            return True
    except Exception:
        return False


def safe_filename(name: str, ext: str) -> str:
    safe = re.sub(r"[\\/:*?\"<>|]", "", name).strip()
    return f"{safe}.{ext}"


def download_icon(url: str, name: str) -> str | None:
    if not url or url.lower() in ("null", "none", ""):
        return None
    try:
        ext = "png"
        path = urllib.parse.urlparse(url).path.lower()
        for cand in ("png", "jpg", "jpeg", "webp", "svg", "ico", "gif"):
            if path.endswith("." + cand):
                ext = cand
                break
        target = ICONS / safe_filename(name, ext)
        if target.exists() and target.stat().st_size > 0:
            return target.name
        data = http_get(url, timeout=10)
        if not data or len(data) < 200:
            return None
        target.write_bytes(data)
        return target.name
    except Exception:
        return None


def main() -> int:
    if not XLSX_PATH.exists():
        print(f"❌ Missing {XLSX_PATH}", file=sys.stderr)
        return 1

    print("→ Reading existing radios from radios.xlsx…")
    existing = load_existing_xlsx(XLSX_PATH)
    print(f"  found {len(existing)} existing radios")

    seen_names = {normalize_name(r["name"]) for r in existing}
    seen_urls = {r["url"].split("?")[0].rstrip("/") for r in existing}

    candidates = fetch_candidates()
    print(f"→ {len(candidates)} candidates from API")

    additions: list[dict] = []
    skipped_dupe = skipped_unclean = skipped_dead = skipped_bitrate = 0

    for c in candidates:
        name = (c.get("name") or "").strip()
        url = (c.get("url_resolved") or c.get("url") or "").strip()
        if not name or not url:
            continue
        bitrate = c.get("bitrate") or 0
        codec = (c.get("codec") or "").lower()
        if c.get("lastcheckok") != 1:
            continue
        if bitrate and bitrate < 32:
            skipped_bitrate += 1
            continue
        if not looks_clean(name):
            skipped_unclean += 1
            continue
        norm = normalize_name(name)
        if norm in seen_names:
            skipped_dupe += 1
            continue
        url_key = url.split("?")[0].rstrip("/")
        if url_key in seen_urls:
            skipped_dupe += 1
            continue
        pretty = title_case(name)
        additions.append({
            "name": pretty,
            "url": url,
            "bitrate": bitrate,
            "codec": codec,
            "favicon": (c.get("favicon") or "").strip(),
            "homepage": c.get("homepage") or "",
            "tags": c.get("tags") or "",
            "votes": c.get("votes") or 0,
            "clickcount": c.get("clickcount") or 0,
        })
        seen_names.add(norm)
        seen_urls.add(url_key)
        if len(additions) >= 25:
            break

    print(f"  shortlisted {len(additions)} (dupes:{skipped_dupe} unclean:{skipped_unclean} bitrate:{skipped_bitrate})")

    print("→ Verifying stream reachability + downloading icons…")
    ICONS.mkdir(parents=True, exist_ok=True)
    accepted: list[dict] = []
    icons_downloaded = 0
    for i, r in enumerate(additions, 1):
        ok = stream_works(r["url"])
        if not ok:
            print(f"  [{i:02d}] ✗ dead     {r['name'][:40]:40s} {r['url'][:60]}")
            skipped_dead += 1
            continue
        icon_file = download_icon(r["favicon"], r["name"]) if r["favicon"] else None
        if icon_file:
            icons_downloaded += 1
        flag = "🖼" if icon_file else "·"
        print(f"  [{i:02d}] ✓ {flag}     {r['name'][:40]:40s} {r['codec'].upper():4s} {r['bitrate']}k")
        accepted.append({
            "name": r["name"],
            "url": r["url"],
            "bitrate": r["bitrate"],
            "codec": r["codec"],
            "tags": r["tags"],
            "homepage": r["homepage"],
            "iconFile": icon_file,
        })

    print(f"  accepted {len(accepted)} / dead {skipped_dead}, icons saved {icons_downloaded}")

    final = [
        {"name": r["name"], "url": r["url"], "source": "manual"} for r in existing
    ] + [
        {
            "name": r["name"],
            "url": r["url"],
            "source": "radio-browser",
            "bitrate": r["bitrate"],
            "codec": r["codec"],
            "tags": r["tags"],
            "iconFile": r["iconFile"],
        }
        for r in accepted
    ]

    JSON_PATH.write_text(json.dumps(final, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"→ Wrote {JSON_PATH.relative_to(ROOT)} ({len(final)} radios)")

    print("\n=== SUMMARY ===")
    print(f"existing: {len(existing)}")
    print(f"added   : {len(accepted)}")
    print(f"total   : {len(final)}")
    print(f"icons dl: {icons_downloaded}")
    print("Added stations:")
    for r in accepted:
        print(f"  + {r['name']}  ({r['codec'].upper()} {r['bitrate']}k)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
