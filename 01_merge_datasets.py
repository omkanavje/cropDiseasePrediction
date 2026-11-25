import random
import re
import shutil
from pathlib import Path
import yaml

# --- EXACT PATHS FOR YOUR PROJECT ---
RAW_DIR = Path("rawDatasets")
FIELDPLANT_DIR = RAW_DIR / "plantDoc"               # FieldPlant YOLO dataset
PLANTVILLAGE_DIR = RAW_DIR / "plantvillage" / "color"

OUT_DIR = Path("unified_dataset")
MAX_PV_PER_CLASS = 150   # Caps lab images so real-world field images aren't drowned out
VAL_SPLIT = 0.15         # 15% validation split
IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp"}

random.seed(42)
class_to_id = {}


def normalize_class(name: str) -> str:
    name = name.lower().strip()
    return re.sub(r"[^a-z0-9]+", "_", name).strip("_")


def get_class_id(raw_name: str) -> int:
    norm = normalize_class(raw_name)
    if norm not in class_to_id:
        class_to_id[norm] = len(class_to_id)
    return class_to_id[norm]


def setup_output_dirs():
    for split in ("train", "valid"):
        (OUT_DIR / split / "images").mkdir(parents=True, exist_ok=True)
        (OUT_DIR / split / "labels").mkdir(parents=True, exist_ok=True)


def save_sample(img_path: Path, label_lines: list[str], split: str, prefix: str, idx: int):
    if not label_lines:
        return
    safe_stem = re.sub(r"[^a-zA-Z0-9_-]+", "_", img_path.stem)[:40]
    new_stem = f"{prefix}_{idx}_{safe_stem}"
    dst_img = OUT_DIR / split / "images" / f"{new_stem}{img_path.suffix.lower()}"
    dst_lbl = OUT_DIR / split / "labels" / f"{new_stem}.txt"

    shutil.copy2(img_path, dst_img)
    dst_lbl.write_text("\n".join(label_lines) + "\n", encoding="utf-8")


def merge_yolo_dataset(dataset_dir: Path, prefix: str):
    yaml_files = list(dataset_dir.rglob("data.yaml"))
    if not yaml_files:
        print(f"[ERROR] No data.yaml found in {dataset_dir}")
        return

    yaml_path = yaml_files[0]
    base_dir = yaml_path.parent
    cfg = yaml.safe_load(yaml_path.read_text(encoding="utf-8"))
    raw_names = cfg["names"]
    id_to_name = raw_names if isinstance(raw_names, dict) else {i: n for i, n in enumerate(raw_names)}

    has_valid = (base_dir / "valid" / "images").exists() or (base_dir / "val" / "images").exists()
    count = 0

    for split_folder in ("train", "valid", "val", "test"):
        img_dir = base_dir / split_folder / "images"
        lbl_dir = base_dir / split_folder / "labels"
        if not img_dir.exists():
            continue

        images = [p for p in img_dir.iterdir() if p.suffix.lower() in IMG_EXTS]
        random.shuffle(images)

        for idx, img_path in enumerate(images):
            lbl_path = lbl_dir / f"{img_path.stem}.txt"
            if not lbl_path.exists():
                continue

            remapped = []
            for line in lbl_path.read_text(encoding="utf-8").splitlines():
                parts = line.strip().split()
                if len(parts) < 5:
                    continue
                old_id = int(parts[0])
                new_id = get_class_id(id_to_name[old_id])
                remapped.append(f"{new_id} " + " ".join(parts[1:5]))

            if has_valid:
                target_split = "valid" if split_folder in ("valid", "val") else "train"
            else:
                target_split = "valid" if idx < int(len(images) * VAL_SPLIT) else "train"

            save_sample(img_path, remapped, target_split, f"{prefix}_{split_folder}", count)
            count += 1

    print(f"[OK] Merged '{prefix}': {count} images.")


def merge_plantvillage(pv_dir: Path, max_per_class: int):
    if not pv_dir.exists():
        print(f"[ERROR] PlantVillage folder not found at {pv_dir}")
        return

    count = 0
    for class_folder in sorted(pv_dir.iterdir()):
        if not class_folder.is_dir():
            continue

        new_id = get_class_id(class_folder.name)
        images = [p for p in class_folder.iterdir() if p.suffix.lower() in IMG_EXTS]
        random.shuffle(images)
        selected = images[:max_per_class]

        for idx, img_path in enumerate(selected):
            split = "valid" if idx < int(len(selected) * VAL_SPLIT) else "train"
            label_line = [f"{new_id} 0.500000 0.500000 0.850000 0.850000"]
            save_sample(img_path, label_line, split, "pv", count)
            count += 1

    print(f"[OK] Merged PlantVillage (max {max_per_class}/class): {count} images.")


def write_unified_yaml():
    id_to_name = {idx: name for name, idx in class_to_id.items()}
    yaml_content = {
        "path": OUT_DIR.resolve().as_posix(),
        "train": "train/images",
        "val": "valid/images",
        "nc": len(id_to_name),
        "names": id_to_name,
    }
    yaml_out = OUT_DIR / "unified_data.yaml"
    yaml_out.write_text(yaml.dump(yaml_content, sort_keys=False), encoding="utf-8")
    print(f"\n[DONE] Saved {yaml_out} with {len(id_to_name)} unified classes.")


if __name__ == "__main__":
    setup_output_dirs()
    merge_yolo_dataset(FIELDPLANT_DIR, prefix="fieldplant")
    merge_plantvillage(PLANTVILLAGE_DIR, max_per_class=MAX_PV_PER_CLASS)
    write_unified_yaml()