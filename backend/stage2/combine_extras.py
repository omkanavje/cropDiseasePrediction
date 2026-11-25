"""Put all extra_*.json files into the single remedies.json.

Usage (in the folder with remedies.json and the extra files):
    python combine_extras.py

- Checks every extra entry first. Bad entries are skipped and listed; good ones are added.
- Never changes or removes an existing entry (new entries are added after the 38 original ones).
- Saves remedies.backup.json before writing.
- Renames each merged file to extra_XX.json.merged so it is not merged twice.
"""
import json
import shutil
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
MAIN = HERE / "remedies.json"
OK_STATUS = ("SOURCED", "PARTIAL", "NOT_YET_SOURCED", "HEALTHY")


def check(key, e):
    if not isinstance(e, dict):
        return "entry is not an object"
    if not e.get("crop") or not e.get("disease"):
        return "missing crop or disease"
    st = e.get("status", "")
    if not st.startswith(OK_STATUS):
        return "status must start with SOURCED, PARTIAL, NOT_YET_SOURCED or HEALTHY"
    for f in ("organic_cultural", "chemical"):
        v = e.get(f, [])
        if not isinstance(v, list) or not all(isinstance(x, str) and x.strip() for x in v):
            return f"'{f}' must be a list of non-empty strings"
    if st.startswith(("SOURCED", "PARTIAL")):
        if not str(e.get("source", "")).startswith("http"):
            return "needs a source URL starting with http"
        if not (e.get("organic_cultural") or e.get("chemical")):
            return "needs at least one remedy line"
    return None


def main():
    files = sorted(HERE.glob("extra_*.json"))
    if not files:
        print("No extra_*.json files found in this folder. Nothing to do.")
        return
    data = json.loads(MAIN.read_text(encoding="utf-8"))
    shutil.copy(MAIN, HERE / "remedies.backup.json")
    added = skipped = 0
    for f in files:
        try:
            extra = json.loads(f.read_text(encoding="utf-8"))
        except Exception as ex:
            print(f"SKIPPED WHOLE FILE {f.name}: not valid JSON ({ex})")
            continue
        for k, e in extra.items():
            problem = check(k, e)
            if k in data:
                print(f"skipped {k}: already in remedies.json")
                skipped += 1
            elif problem:
                print(f"skipped {k}: {problem}")
                skipped += 1
            else:
                data[k] = e
                added += 1
        f.rename(f.with_name(f.name + ".merged"))
    MAIN.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    c = Counter(v["status"].split(" ")[0].split("-")[0] for v in data.values())
    print(f"\nAdded {added} entries, skipped {skipped}.")
    print(f"remedies.json now has {len(data)} entries: {dict(c)}")
    print("Backup saved as remedies.backup.json. Now run: python test_stage2.py")


if __name__ == "__main__":
    main()
