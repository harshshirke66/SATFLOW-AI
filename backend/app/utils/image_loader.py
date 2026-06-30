import base64
import cv2
import io
import numpy as np
from PIL import Image

def load_image_from_bytes(content: bytes) -> np.ndarray:
    """Loads an image from raw bytes into an OpenCV BGR numpy array."""
    nparr = np.frombuffer(content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image file format or corrupted file.")
    return img

def to_base64(img_bgr: np.ndarray, format: str = "png") -> str:
    """Converts a BGR OpenCV image into a base64 encoded string."""
    _, buffer = cv2.imencode(f".{format}", img_bgr)
    b64_str = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/{format};base64,{b64_str}"

def read_image_as_base64(filepath: str, format: str = "png") -> str:
    """Reads a file from disk and encodes it as base64."""
    with open(filepath, "rb") as f:
        content = f.read()
    b64_str = base64.b64encode(content).decode("utf-8")
    return f"data:image/{format};base64,{b64_str}"
