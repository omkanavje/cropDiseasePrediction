"""Stage 2: disease class name in, verified remedy out.

No model, no training. Reads remedies.json (same folder) and returns the entry.
Nothing here invents advice: unsourced diseases return a "not available" message.
"""
import json
import re
from pathlib import Path

_DATA_FILE = Path(__file__).with_name("remedies.json")

NOT_AVAILABLE_MSG = (
    "Verified remedy not available yet. "
    "Please consult your local agriculture officer."
)
DISCLAIMER = (
    "Doses come from the cited source. Always follow the product label "
    "and your local agriculture officer's advice."
)


def _norm(text: str) -> str:
    """'Tomato___Late_blight', 'tomato late blight' -> 'tomato late blight'"""
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


with open(_DATA_FILE, encoding="utf-8") as f:
    _DATA = json.load(f)

# normalized name -> original key (also matches "crop disease" without the ___)
_INDEX = {}
for _key, _entry in _DATA.items():
    _INDEX[_norm(_key)] = _key
    _INDEX[_norm(f"{_entry['crop']} {_entry['disease']}")] = _key


def get_remedy(class_name: str) -> dict:
    """Return a dict the backend/frontend can show directly.

    result["result_type"] is one of:
      "sourced"       - verified entry with source link
      "partial"       - some info only; read the "note"
      "healthy"       - plant is healthy
      "not_available" - disease known, remedy not sourced yet
      "unknown_class" - name not in remedies.json
    """
    key = _INDEX.get(_norm(class_name))
    if key is None:
        return {"result_type": "unknown_class", "class": class_name,
                "message": NOT_AVAILABLE_MSG}

    e = _DATA[key]
    status = e.get("status", "")
    base = {"class": key, "crop": e["crop"], "disease": e["disease"]}

    if status.startswith("HEALTHY"):
        return {**base, "result_type": "healthy",
                "message": "Plant looks healthy. Keep monitoring leaves weekly."}

    if status.startswith("NOT_YET_SOURCED"):
        return {**base, "result_type": "not_available",
                "message": NOT_AVAILABLE_MSG}

    return {
        **base,
        "result_type": "partial" if status.startswith("PARTIAL") else "sourced",
        "organic_cultural": e.get("organic_cultural", []),
        "chemical": e.get("chemical", []),
        "source": e.get("source", ""),
        "source_note": e.get("source_note", ""),
        "note": status,
        "disclaimer": DISCLAIMER,
    }


def build_llm_prompt(remedy: dict) -> str:
    """Optional Step 3: give this to Gemini. It may only rewrite, not add."""
    return (
        "Explain the following verified crop-disease advice in simple, "
        "farmer-friendly steps. Use ONLY the information below. Do not add, "
        "change or guess any chemical, dose or step. Keep every dose exactly "
        "as written.\n\n" + json.dumps(remedy, indent=2, ensure_ascii=False)
    )


if __name__ == "__main__":
    for name in ["Tomato___Late_blight", "tomato late blight",
                 "Apple___Apple_scab", "Potato___healthy", "Banana___xyz"]:
        r = get_remedy(name)
        print(name, "->", r["result_type"])
