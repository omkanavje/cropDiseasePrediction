import cv2
import gradio as gr
from ultralytics import YOLO

model = YOLO("best.pt")


def format_label(raw_name: str) -> str:
    return raw_name.replace("_", " ").title()


def predict_leaf(image_rgb):
    if image_rgb is None:
        return None, "Upload a leaf photo or capture one with your camera."

    img_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

    results = model.predict(source=img_bgr, conf=0.20, verbose=False)[0]
    if len(results.boxes) == 0:
        results = model.predict(source=img_bgr, conf=0.005, max_det=1, verbose=False)[0]
    if len(results.boxes) == 0:
        h, w = img_bgr.shape[:2]
        padded = cv2.copyMakeBorder(
            img_bgr, int(h * 0.25), int(h * 0.25), int(w * 0.25), int(w * 0.25),
            cv2.BORDER_CONSTANT, value=(128, 128, 128)
        )
        results = model.predict(source=padded, conf=0.0, max_det=1, verbose=False)[0]

    annotated_rgb = cv2.cvtColor(results.plot(), cv2.COLOR_BGR2RGB)

    if len(results.boxes) == 0:
        return annotated_rgb, "No disease or pest detected."

    output_lines = []
    for i, box in enumerate(results.boxes, start=1):
        disease = format_label(model.names[int(box.cls[0])])
        conf = float(box.conf[0]) * 100
        output_lines.append(f"{i}. {disease} ({conf:.2f}% confidence)")

    return annotated_rgb, "\n".join(output_lines)


demo = gr.Interface(
    fn=predict_leaf,
    inputs=gr.Image(
        sources=["upload", "webcam"],
        type="numpy",
        label="Upload Leaf Photo or Capture with Camera",
    ),
    outputs=[
        gr.Image(type="numpy", label="Detected Region"),
        gr.Textbox(label="Detected Plant Disease / Pest", lines=4),
    ],
    title="Plant Disease & Pest Detection",
    description="Upload a leaf photo or use your camera to detect plant diseases and pests.",
)

if __name__ == "__main__":
    demo.launch(inbrowser=True)
