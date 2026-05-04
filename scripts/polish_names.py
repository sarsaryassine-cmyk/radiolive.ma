"""Polish auto-fetched radio names — cosmetic cleanup only."""

import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "public" / "radios.json"
ICONS = ROOT / "public" / "icons"

RENAMES = {
    "Mefi1 Tarab": "Medi 1 Tarab",
    "Adwaafm": "Adwaa FM",
    "Rap Lbeldi Maroc - Hip Hop Music From Morocco Fr Ar": "Rap Lbeldi Maroc",
    "Marrakechplus": "Marrakech Plus",
    "Medi1 DJ": "Medi 1 DJ",
    "Radio Achkid FM راديوأشكيدإف إم": "Radio Achkid FM",
    "Aziz Mustaphi": "Aziz Al Mustaphi",
    "Abdulbasit Abdulsamad": "Abdul Basit",
    "Radio Plus Agadir FM 92.4": "Radio Plus Agadir",
}


def main():
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    seen = set()
    cleaned = []
    for r in data:
        old = r["name"]
        new = RENAMES.get(old, old)
        new = re.sub(r"\s+", " ", new).strip()
        if new.lower() in seen:
            continue
        seen.add(new.lower())
        if new != old and r.get("iconFile"):
            old_icon = ICONS / r["iconFile"]
            ext = old_icon.suffix.lstrip(".")
            new_icon = ICONS / f"{new}.{ext}"
            if old_icon.exists() and not new_icon.exists():
                old_icon.rename(new_icon)
                r["iconFile"] = new_icon.name
        r["name"] = new
        cleaned.append(r)
    JSON_PATH.write_text(json.dumps(cleaned, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Polished {len(cleaned)} radios")
    for r in cleaned:
        print(f"  {r['name']}")


if __name__ == "__main__":
    main()
