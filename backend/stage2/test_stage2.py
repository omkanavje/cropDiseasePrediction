"""Run:  python test_stage2.py
Prints PASS/FAIL for each check. No internet or API key needed.
"""
import json
from pathlib import Path

ok = True


def check(name, cond):
    global ok
    print(("PASS  " if cond else "FAIL  ") + name)
    ok = ok and cond


try:
    from remedies import get_remedy
    from advisor import get_advice
    check("files import correctly (remedies.py, advisor.py)", True)
except Exception as e:
    print("FAIL  could not import:", e)
    print("Fix: put remedies.json, remedies.py, advisor.py and test_stage2.py in the SAME folder.")
    raise SystemExit(1)

data = json.loads(Path(__file__).with_name("remedies.json").read_text(encoding="utf-8"))
check("remedies.json has 38 classes", len(data) == 38)

# every class name must be found by the lookup
missing = [k for k in data if get_remedy(k)["result_type"] == "unknown_class"]
check("every class name is found by get_remedy()", not missing)

# different spellings of the same name must work
check("'Tomato___Late_blight' works", get_remedy("Tomato___Late_blight")["result_type"] == "sourced")
check("'tomato late blight' works", get_remedy("tomato late blight")["result_type"] == "sourced")

# sourced entries must have a source link and at least one remedy
bad = [k for k, v in data.items()
       if v["status"].startswith("SOURCED")
       and not (v.get("source") and (v.get("chemical") or v.get("organic_cultural")))]
check("every SOURCED entry has a source link and remedy text", not bad)

check("healthy plant -> healthy message", get_remedy("Potato___healthy")["result_type"] == "healthy")
check("unsourced disease -> 'not available' message",
      get_remedy("Apple___Black_rot")["result_type"] == "not_available")
check("unknown name -> safe message", get_remedy("Banana___xyz")["result_type"] == "unknown_class")

# advisor works even with no Gemini key (falls back to plain verified text)
out = get_advice("Tomato___Late_blight", llm=lambda p: (_ for _ in ()).throw(RuntimeError("no key")))
check("advisor falls back safely when Gemini is unavailable",
      out["advice"] and out["rewritten_by_llm"] is False)

# invented dose must be rejected
out = get_advice("Tomato___Late_blight", llm=lambda p: "Spray 999 ml per acre")
check("advisor rejects a dose that is not in the source", out["rewritten_by_llm"] is False)

print("\nALL CHECKS PASSED - Stage 2 is working." if ok else "\nSOME CHECKS FAILED - send me the lines marked FAIL.")
