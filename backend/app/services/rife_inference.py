import os
import sys
import urllib.request
import torch
import numpy as np
from pathlib import Path

# Add RIFE directory to sys.path
from app.config import MODEL_DIR, TRAIN_LOG_DIR, WEIGHTS_PATH, DEVICE
sys.path.append(str(MODEL_DIR))

# Download URLs for RIFE v3 dependencies
RIFE_WEIGHTS_URL = "https://huggingface.co/Anson-Saju-George/wms-rifev3/resolve/main/train_log/flownet.pkl"
RIFE_PY_URL = "https://huggingface.co/Anson-Saju-George/wms-rifev3/resolve/main/train_log/RIFE_HDv3.py"
IFNET_PY_URL = "https://huggingface.co/Anson-Saju-George/wms-rifev3/resolve/main/train_log/IFNet_HDv3.py"

# Local file paths
RIFE_PY_PATH = TRAIN_LOG_DIR / "RIFE_HDv3.py"
IFNET_PY_PATH = TRAIN_LOG_DIR / "IFNet_HDv3.py"

# Cached model state
_rife_model = None
_model_loaded = False
_load_error = None

def download_file(url: str, dest_path: Path):
    """Downloads a file from a URL to a local destination if it doesn't exist."""
    if not dest_path.exists():
        print(f"[RIFE] Downloading missing file: {dest_path.name}...")
        try:
            TRAIN_LOG_DIR.mkdir(parents=True, exist_ok=True)
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            )
            with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
                shutil_block_size = 1024 * 1024
                while True:
                    buffer = response.read(shutil_block_size)
                    if not buffer:
                        break
                    out_file.write(buffer)
            print(f"[RIFE] Successfully downloaded {dest_path.name}")
        except Exception as e:
            print(f"[RIFE] Failed to download {dest_path.name}: {e}")
            raise

def setup_rife_assets():
    """Verifies and downloads all RIFE model components."""
    download_file(RIFE_WEIGHTS_URL, WEIGHTS_PATH)
    download_file(RIFE_PY_URL, RIFE_PY_PATH)
    download_file(IFNET_PY_URL, IFNET_PY_PATH)

def load_rife_model():
    """Initializes and loads the RIFE model into memory once. Follows startup logs specs."""
    global _rife_model, _model_loaded, _load_error
    if _model_loaded:
        return True
        
    print("\nLoading pretrained RIFE...")
    try:
        # Download assets
        setup_rife_assets()
        print("Weights Found")
        
        # Import the model dynamically
        from train_log.RIFE_HDv3 import Model
        
        # Instantiate and load model weights
        model = Model()
        model.load_model(str(TRAIN_LOG_DIR), -1)
        model.eval()
        model.device()
        
        _rife_model = model
        _model_loaded = True
        print("Model Loaded Successfully")
        if torch.cuda.is_available():
            print("Running on CUDA\n")
        else:
            print("Running on CPU\n")
        return True
    except Exception as e:
        _load_error = str(e)
        print(f"Model Loading Failed: {e}\n")
        return False

def get_model_status() -> dict:
    """Returns the loaded status and devices."""
    global _model_loaded, _load_error
    return {
        "available": _model_loaded,
        "device": "CUDA" if torch.cuda.is_available() else "CPU",
        "gpu_available": torch.cuda.is_available(),
        "error": _load_error
    }

def rife_interpolate(img0_bgr: np.ndarray, img1_bgr: np.ndarray, num_frames: int = 1) -> list[np.ndarray]:
    """
    Interpolates 1, 3, or 5 frames between img0 and img1 using RIFE v3.
    Uses bisection search matching the midpoint-only interpolation limits of RIFE v3.
    """
    global _rife_model, _model_loaded
    
    if not _model_loaded:
        success = load_rife_model()
        if not success:
            raise RuntimeError(f"RIFE model is not available: {_load_error}")
            
    from app.utils.preprocessing import preprocess_frame, postprocess_tensor
    
    # Preprocess inputs
    img0_tensor, (h, w, pad_h, pad_w) = preprocess_frame(img0_bgr, DEVICE)
    img1_tensor, _ = preprocess_frame(img1_bgr, DEVICE)
    
    generated_tensors = []
    
    with torch.no_grad():
        if num_frames == 1:
            # t = 0.5 midpoint
            f5 = _rife_model.inference(img0_tensor, img1_tensor)
            generated_tensors = [f5]
            
        elif num_frames == 3:
            # t = 0.5
            f5 = _rife_model.inference(img0_tensor, img1_tensor)
            # t = 0.25 (between 0 and 0.5)
            f25 = _rife_model.inference(img0_tensor, f5)
            # t = 0.75 (between 0.5 and 1)
            f75 = _rife_model.inference(f5, img1_tensor)
            generated_tensors = [f25, f5, f75]
            
        elif num_frames == 5:
            # t = 0.5
            f5 = _rife_model.inference(img0_tensor, img1_tensor)
            # t = 0.25, 0.75
            f25 = _rife_model.inference(img0_tensor, f5)
            f75 = _rife_model.inference(f5, img1_tensor)
            # Subdivide to get 7 frames:
            f125 = _rife_model.inference(img0_tensor, f25)  # 0.125
            f375 = _rife_model.inference(f25, f5)          # 0.375
            f625 = _rife_model.inference(f5, f75)          # 0.625
            f875 = _rife_model.inference(f75, img1_tensor)  # 0.875
            # Sample 5 frames: 0.125, 0.375, 0.5, 0.625, 0.875 (extremely smooth)
            generated_tensors = [f125, f375, f5, f625, f875]
            
        else:
            raise ValueError("Only 1, 3, or 5 frames are supported.")
            
    # Postprocess tensors back to BGR numpy arrays
    return [postprocess_tensor(t, h, w) for t in generated_tensors]
