"""Stage 2 advisory engine.

Flow:  disease class name -> remedies.json lookup -> Gemini rewrites the
verified text in simple language -> safety check -> answer.

Safety rules (so the LLM never invents a dose):
  1. Gemini is only called when a verified entry exists (sourced / partial).
     Healthy, not_available and unknown_class never go to the LLM.
  2. Gemini is told to use ONLY the given text.
  3. Every number in Gemini's answer must also appear in the verified entry.
     If not, we discard the LLM text and show the plain verified text instead.
  4. If there is no API key or Gemini fails, we also show the plain text.

Setup:  pip install google-genai
        set GEMINI_API_KEY=your_key      (Windows cmd)
Optional: set GEMINI_MODEL=...  (default below; check Google AI Studio for the current name)
"""
import json
import os
import re
import unicodedata

from remedies import DISCLAIMER, get_remedy

GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")


def _plain_text(r: dict) -> str:
    """Plain, unmodified rendering of the verified entry (always safe)."""
    lines = [f"{r['crop']} - {r['disease']}"]
    if r.get("organic_cultural"):
        lines.append("What you can do (cultural / organic):")
        lines += [f"  - {x}" for x in r["organic_cultural"]]
    if r.get("chemical"):
        lines.append("Chemical options (doses as given by the source):")
        lines += [f"  - {x}" for x in r["chemical"]]
    lines.append(f"Source: {r['source']}")
    if r["result_type"] == "partial":
        lines.append(f"Note (incomplete information): {r['note']}")
    lines.append(DISCLAIMER)
    return "\n".join(lines)


def _numbers(text: str) -> set:
    # convert Hindi/Marathi/etc. digits to 0-9 so the check works in any language
    text = "".join(str(unicodedata.decimal(c)) if c.isdecimal() else c for c in text)
    return set(re.findall(r"\d+(?:\.\d+)?", text))


def _build_prompt(r: dict, language: str) -> str:
    facts = {k: r[k] for k in ("crop", "disease", "organic_cultural", "chemical") if k in r}
    return (
        f"You are helping a farmer. Rewrite the verified advice below in simple, "
        f"clear steps in {language}.\n"
        "STRICT RULES:\n"
        "- Use ONLY the information in the JSON below.\n"
        "- Do NOT add any chemical, dose, number, timing or step that is not in the JSON.\n"
        "- Keep every dose and number exactly as written.\n"
        "- If a list is empty, do not invent anything for it.\n"
        "- Keep it short. Plain text, no markdown tables.\n\n"
        + json.dumps(facts, indent=2, ensure_ascii=False)
    )


def _call_gemini(prompt: str) -> str:
    from google import genai  # imported here so the rest works without the package

    client = genai.Client()  # reads GEMINI_API_KEY from the environment
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
    return (resp.text or "").strip()


def get_advice(class_name: str, language: str = "English", llm=_call_gemini) -> dict:
    """Main function for the backend. `llm` can be swapped for testing."""
    r = get_remedy(class_name)

    # Rule 1: no verified data -> no LLM, just the safe message.
    if r["result_type"] in ("healthy", "not_available", "unknown_class"):
        return {"result_type": r["result_type"], "advice": r["message"],
                "rewritten_by_llm": False, "remedy": r}

    plain = _plain_text(r)
    try:
        text = llm(_build_prompt(r, language))
    except Exception as e:  # no key, no internet, quota, etc.
        return {"result_type": r["result_type"], "advice": plain,
                "rewritten_by_llm": False, "note": f"LLM unavailable: {type(e).__name__}",
                "remedy": r}

    # Rule 3: every number in the LLM text must come from the verified entry.
    allowed = _numbers(json.dumps({k: r.get(k) for k in ("organic_cultural", "chemical")}))
    extra = _numbers(text) - allowed
    if not text or extra:
        return {"result_type": r["result_type"], "advice": plain,
                "rewritten_by_llm": False,
                "note": f"LLM output rejected (numbers not in source: {sorted(extra)})",
                "remedy": r}

    return {"result_type": r["result_type"],
            "advice": text + f"\n\nSource: {r['source']}"
                      + (f"\nNote (incomplete information): {r['note']}" if r["result_type"] == "partial" else "")
                      + f"\n{DISCLAIMER}",
            "rewritten_by_llm": True, "remedy": r}


if __name__ == "__main__":
    out = get_advice("Tomato___Late_blight")
    print(out["advice"])
    print("\nrewritten_by_llm:", out["rewritten_by_llm"], out.get("note", ""))
