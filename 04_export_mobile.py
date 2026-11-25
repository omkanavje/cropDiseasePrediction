from ultralytics import YOLO

model = YOLO("crop_ai_runs/stage1_yolo26/weights/best.pt")
model.export(format="onnx", simplify=True)
model.export(format="tflite", int8=True, data="unified_dataset/unified_data.yaml")