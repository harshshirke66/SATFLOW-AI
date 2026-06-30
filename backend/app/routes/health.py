from fastapi import APIRouter
import torch
from app.services.rife_inference import get_model_status

router = APIRouter()

@router.get("")
def health_check():
    """Health check endpoint that returns API status and hardware configuration."""
    model_status = get_model_status()
    
    return {
        "status": "ok",
        "hardware": {
            "gpu_available": torch.cuda.is_available(),
            "gpu_device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None",
            "device_used": model_status["device"]
        },
        "rife_model": model_status
    }
