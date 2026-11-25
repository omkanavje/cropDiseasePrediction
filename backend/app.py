"""Combined backend.  Save this as  backend/app.py  in the repo.

Folder layout it expects:
    backend/
        app.py                  <- this file
        stage1/predict.py       <- model friend writes predict_disease()
        stage2/                 <- remedies.json, remedies.py, advisor.py

Run (from inside the backend folder):
    pip install fastapi uvicorn python-multipart google-genai
    uvicorn app:app --reload
Then open http://127.0.0.1:8000/docs to try it.

Stage 1 contract (what the model friend must provide), in stage1/predict.py:
    def predict_disease(image_bytes: bytes):
        ...
        return "Tomato___Late_blight", 0.94      # class name, confidence (0 to 1)
    (returning just the class name string is also fine)
"""
import sys
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE / "stage2"))   # so advisor.py / remedies.py can be imported
sys.path.insert(0, str(HERE))              # so stage1.predict can be imported

from advisor import get_advice  # noqa: E402

try:
    from stage1.predict import predict_disease  # noqa: E402
except Exception:  # Stage 1 not uploaded yet
    predict_disease = None

app = FastAPI(title="Crop disease detection + advisory")
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


# lets the UI (running on another port or laptop) call this backend
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"stage2": "ok", "stage1_connected": predict_disease is not None}


class AdviceRequest(BaseModel):
    disease_class: str
    language: str = "English"


@app.post("/advice")
def advice(req: AdviceRequest):
    """Stage 2 only: disease name in, advice out. Works without Stage 1."""
    return get_advice(req.disease_class, req.language)


@app.post("/predict")
async def predict(file: UploadFile = File(...), language: str = "English"):
    """Full pipeline: photo in -> disease -> verified advice out."""
    if predict_disease is None:
        raise HTTPException(503, "Stage 1 model is not connected yet (backend/stage1/predict.py missing).")
    image_bytes = await file.read()
    out = predict_disease(image_bytes)
    disease_class, confidence = out if isinstance(out, tuple) else (out, None)
    result = get_advice(disease_class, language)
    result["disease_class"] = disease_class
    result["confidence"] = confidence
    return result
