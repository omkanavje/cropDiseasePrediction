import torch
from ultralytics import YOLO

DATA_YAML = "unified_dataset/unified_data.yaml"


def train_model():
    device = 0 if torch.cuda.is_available() else "cpu"
    print(f"Starting training on device: {device}")

    # yolo26n.pt is lightweight and fastest for same-day training
    model = YOLO("yolo26n.pt")

    model.train(
        data=DATA_YAML,
        epochs=25,          # Increase to 50 if you have a dedicated GPU
        imgsz=640,
        batch=16 if device != "cpu" else 8,
        patience=10,
        device=device,
        hsv_h=0.015,
        hsv_s=0.6,
        hsv_v=0.4,
        degrees=25.0,
        fliplr=0.5,
        mosaic=1.0,
        project="crop_ai_runs",
        name="stage1_yolo26",
    )

    metrics = model.val()
    print(f"\nValidation mAP50:    {metrics.box.map50:.4f}")
    print(f"Validation mAP50-95: {metrics.box.map:.4f}")


if __name__ == "__main__":
    train_model()