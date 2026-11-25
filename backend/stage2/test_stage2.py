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
ORIGINAL_38 = ["Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy", "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy", "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy", "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy", "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy", "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy", "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy", "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"]
check("remedies.json contains all 38 original classes", all(k in data for k in ORIGINAL_38))
check(f"remedies.json has {len(data)} entries in total (38 original + extras)", len(data) >= 38)

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
unsourced = [k for k, v in data.items() if v["status"].startswith("NOT_YET_SOURCED")]
if unsourced:
    check("unsourced disease -> 'not available' message",
          get_remedy(unsourced[0])["result_type"] == "not_available")
else:
    print("PASS  (no unsourced diseases left in the main file)")
check("unknown name -> safe message", get_remedy("Banana___xyz")["result_type"] == "unknown_class")

# advisor works even with no Gemini key (falls back to plain verified text)
out = get_advice("Tomato___Late_blight", llm=lambda p: (_ for _ in ()).throw(RuntimeError("no key")))
check("advisor falls back safely when Gemini is unavailable",
      out["advice"] and out["rewritten_by_llm"] is False)

# invented dose must be rejected
out = get_advice("Tomato___Late_blight", llm=lambda p: "Spray 999 ml per acre")
check("advisor rejects a dose that is not in the source", out["rewritten_by_llm"] is False)

# optional extra files for diseases outside the 38 classes
for f in sorted(Path(__file__).parent.glob("extra_*.json")):
    try:
        ex = json.loads(f.read_text(encoding="utf-8"))
        good = all(v.get("status", "").startswith(("SOURCED", "PARTIAL", "NOT_YET_SOURCED"))
                   and (not v["status"].startswith(("SOURCED", "PARTIAL")) or str(v.get("source", "")).startswith("http"))
                   for v in ex.values())
        check(f"{f.name}: {len(ex)} entries, valid format", good)
        check(f"{f.name}: entries are found by get_remedy()",
              all(get_remedy(k)["result_type"] != "unknown_class" for k in ex))
    except Exception as e:
        check(f"{f.name}: readable JSON ({e})", False)

print("\nALL CHECKS PASSED - Stage 2 is working." if ok else "\nSOME CHECKS FAILED - send me the lines marked FAIL.")
