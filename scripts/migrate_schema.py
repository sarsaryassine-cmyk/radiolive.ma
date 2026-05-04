"""Migrate public/radios.json to clean schema: {name, stream, icon}.

Resolves icon paths to the EXACT filename on disk (case-preserving),
which matters when the project is deployed to a case-sensitive
filesystem (Linux server, Vercel, Netlify, GitHub Pages…).
"""

import json
import re
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "public" / "radios.json"
ICONS = ROOT / "public" / "icons"

ICON_EXTS = ("png", "jpg", "jpeg", "webp", "svg", "ico", "gif")


def build_disk_index() -> dict[str, str]:
    """Map lowercased basename-without-ext → real filename on disk."""
    idx: dict[str, str] = {}
    for f in ICONS.iterdir():
        if not f.is_file():
            continue
        if f.suffix.lower().lstrip(".") not in ICON_EXTS:
            continue
        idx.setdefault(f.stem.lower(), f.name)
    return idx


def find_local_icon(name: str, disk: dict[str, str]) -> str | None:
    safe = re.sub(r'[\\/:*?"<>|]', "", name).strip()
    real = disk.get(safe.lower())
    if real:
        return f"/icons/{urllib.parse.quote(real)}"
    return None


def main():
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    disk = build_disk_index()
    out = []
    seen = set()
    for r in data:
        name = (r.get("name") or "").strip()
        stream = (r.get("stream") or r.get("url") or "").strip()
        if not name or not stream:
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)

        icon = None
        if r.get("iconFile"):
            real = disk.get(Path(r["iconFile"]).stem.lower())
            if real:
                icon = f"/icons/{urllib.parse.quote(real)}"
        if not icon:
            icon = find_local_icon(name, disk)

        out.append({"name": name, "stream": stream, "icon": icon})

    JSON_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    with_icon = sum(1 for r in out if r.get("icon"))
    print(f"Migrated {len(out)} radios ({with_icon} with local icon)")


if __name__ == "__main__":
    main()
