import os
from pathlib import Path
import torch

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model" / "rife"
TRAIN_LOG_DIR = MODEL_DIR / "train_log"
OUTPUT_DIR = BASE_DIR / "outputs"
SAMPLE_DIR = BASE_DIR / "sample_data"

# Create directories if they do not exist
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_DIR.mkdir(parents=True, exist_ok=True)
TRAIN_LOG_DIR.mkdir(parents=True, exist_ok=True)

# Application Config
APP_NAME = "SATFLOW AI"
API_PREFIX = "/api"

# Model Config
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
RIFE_WEIGHTS_URL = "https://huggingface.co/Anson-Saju-George/wms-rifev3/resolve/main/train_log/flownet.pkl"
WEIGHTS_PATH = TRAIN_LOG_DIR / "flownet.pkl"
