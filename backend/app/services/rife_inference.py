import os
import sys
import urllib.request
import torch
import numpy as np
from pathlib import Path

# Add the RIFE directory to sys.path to allow imports from model.*
from app.config import MODEL_DIR, TRAIN_LOG_DIR, WEIGHTS_PATH, RIFE_WEIGHTS_URL, DEVICE
sys.path.append(str(MODEL_DIR))

# Global variables for model lazy-loading
_rife_model = None
_model_loaded = False
_load_error = None

def download_weights_if_missing():
    """Downloads RIFE weights from Hugging Face if they do not exist locally."""
    if not WEIGHTS_PATH.exists():
        print(f"[RIFE] Pretrained weights not found at {WEIGHTS_PATH}.")
        print(f"[RIFE] Attempting to download from {RIFE_WEIGHTS_URL}...")
        try:
            TRAIN_LOG_DIR.mkdir(parents=True, exist_ok=True)
            
            # Simple downloader with user-agent to bypass blockages
            req = urllib.request.Request(
                RIFE_WEIGHTS_URL, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            )
            with urllib.request.urlopen(req) as response, open(WEIGHTS_PATH, 'wb') as out_file:
                # Get total size if available
                meta = response.info()
                file_size = int(meta.get("Content-Length", 0))
                print(f"[RIFE] File size: {file_size / (1024*1024):.2f} MB")
                
                block_sz = 8192
                downloaded = 0
                while True:
                    buffer = response.read(block_sz)
                    if not buffer:
                        break
                    downloaded += len(buffer)
                    out_file.write(buffer)
                    # Simple log
                    percent = (downloaded / file_size) * 100 if file_size else 0
                    if downloaded % (block_sz * 100) == 0:
                        print(f"[RIFE] Download progress: {percent:.1f}%")
            print("[RIFE] Download completed successfully!")
            return True
        except Exception as e:
            print(f"[RIFE] Failed to download weights: {e}")
            return False
    return True

def load_rife_model():
    """Initializes and loads the RIFE model. Returns True if successful."""
    global _rife_model, _model_loaded, _load_error
    if _model_loaded:
        return True
    
    # Try downloading weights first
    download_success = download_weights_if_missing()
    if not download_success or not WEIGHTS_PATH.exists():
        _load_error = "Weights file missing and download failed"
        print(f"[RIFE] Loading failed: {_load_error}")
        return False
        
    try:
        # Import the model dynamically
        from model.RIFE import Model
        
        # Instantiate model
        print("[RIFE] Initializing RIFE model architecture...")
        model = Model(arbitrary=True) # Arbitrary timestep interpolation
        print(f"[RIFE] Loading model weights from {TRAIN_LOG_DIR}...")
        model.load_model(str(TRAIN_LOG_DIR), -1)
        model.eval()
        model.device()
        
        _rife_model = model
        _model_loaded = True
        print(f"[RIFE] Model loaded successfully on device: {DEVICE}")
        return True
    except Exception as e:
        _load_error = str(e)
        print(f"[RIFE] Error loading RIFE model: {e}")
        return False

def get_model_status() -> dict:
    """Returns the loading status of the RIFE model."""
    global _model_loaded, _load_error
    # Force a load attempt if not done yet
    if not _model_loaded and _load_error is None:
        load_rife_model()
    return {
        "available": _model_loaded,
        "device": DEVICE,
        "error": _load_error
    }

def rife_interpolate(img0_bgr: np.ndarray, img1_bgr: np.ndarray, num_frames: int = 1) -> list[np.ndarray]:
    """
    Interpolates num_frames intermediate frames between img0 and img1 using RIFE.
    If RIFE is not loaded, raises a RuntimeError (calling code should fall back).
    """
    global _rife_model, _model_loaded
    
    if not _model_loaded:
        success = load_rife_model()
        if not success:
            raise RuntimeError(f"RIFE model is not available: {_load_error}")
            
    from app.utils.preprocessing import preprocess_frame, postprocess_tensor
    
    # Preprocess frames
    img0_tensor, (h, w, pad_h, pad_w) = preprocess_frame(img0_bgr, DEVICE)
    img1_tensor, _ = preprocess_frame(img1_bgr, DEVICE)
    
    # We generate frames at intervals:
    # E.g. if num_frames = 3, we want timesteps at 0.25, 0.50, 0.75
    # Step size is 1 / (num_frames + 1)
    step = 1.0 / (num_frames + 1)
    timesteps = [step * (i + 1) for i in range(num_frames)]
    
    generated_frames = []
    with torch.no_grad():
        for t in timesteps:
            # RIFE inference takes arbitrary timestep
            # Scale defaults to 1.0. Lower resolution images run faster at scale=1
            output_tensor = _rife_model.inference(img0_tensor, img1_tensor, timestep=t)
            
            # Postprocess back to BGR numpy array
            frame_bgr = postprocess_tensor(output_tensor, h, w)
            generated_frames.append(frame_bgr)
            
    return generated_frames
