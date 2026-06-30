import os
import time
import cv2
import numpy as np
from pathlib import Path
from app.config import OUTPUT_DIR

def save_output_image(img_bgr: np.ndarray, filename: str) -> str:
    """Saves a BGR numpy image to the outputs directory and returns its relative URL/filepath."""
    filepath = OUTPUT_DIR / filename
    cv2.imwrite(str(filepath), img_bgr)
    return f"/static/{filename}"

def cleanup_old_files(max_age_seconds: int = 1800):
    """Cleans up files in the outputs directory that are older than max_age_seconds."""
    now = time.time()
    try:
        for item in OUTPUT_DIR.iterdir():
            if item.is_file() and item.suffix.lower() in [".png", ".jpg", ".jpeg", ".exr"]:
                # Check modification time
                stat = item.stat()
                age = now - stat.st_mtime
                if age > max_age_seconds:
                    item.unlink()
    except Exception as e:
        print(f"Error during outputs cleanup: {e}")
