import json
import sys
import cv2
from ultralytics import YOLO

model = YOLO("best.pt")


def format_label(raw_name: str) -> str:
    return raw_name.replace("_", " ").title()


def detect_disease(image_path: str, save_annotated: str = "diagnosed_output.jpg") -> str:
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Could not read image at: {image_path}")

    # Pass 1: Standard detection on original image
    results = model.predict(source=img, conf=0.20, verbose=False)[0]

    # Pass 2: Low-threshold top-1 detection on original image
    if len(results.boxes) == 0:
        results = model.predict(source=img, conf=0.005, max_det=1, verbose=False)[0]

    # Pass 3: Add neutral border for macro close-ups and return top-1 ranked disease/pest
    if len(results.boxes) == 0:
        h, w = img.shape[:2]
        padded = cv2.copyMakeBorder(
            img, int(h * 0.25), int(h * 0.25), int(w * 0.25), int(w * 0.25),
            cv2.BORDER_CONSTANT, value=(128, 128, 128)
        )
        results = model.predict(source=padded, conf=0.0, max_det=1, verbose=False)[0]

    if save_annotated:
        results.save(filename=save_annotated)

    detections = []
    for box in results.boxes:
        cls_id = int(box.cls[0])
        raw_label = model.names[cls_id]
        detections.append({
            "detected_disease_or_pest": format_label(raw_label),
            "raw_class": raw_label,
            "confidence": round(float(box.conf[0]), 4),
            "bbox_xyxy": [round(v, 1) for v in box.xyxy[0].tolist()],
        })

    return json.dumps({
        "image": image_path,
        "annotated_output": save_annotated,
        "total_detections": len(detections),
        "detections": detections,
    }, indent=2)


if __name__ == "__main__":
    img_arg = sys.argv[1] if len(sys.argv) > 1 else "test_leaf.jpeg"
    print(detect_disease(img_arg))
