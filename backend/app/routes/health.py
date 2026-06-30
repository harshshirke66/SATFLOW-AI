from fastapi import APIRouter
from app.services.rife_inference import get_model_status

router = APIRouter()

@router.get("")
def health_check():
    """Health check endpoint that returns exact RIFE loading status and hardware configuration."""
    model_status = get_model_status()
    
    weights_loaded = model_status["available"]
    fallback = not weights_loaded
    engine = "RIFE" if weights_loaded else "Farneback"
    
    return {
        "status": "ok",
        "device": model_status["device"],
        "gpu_available": model_status["gpu_available"],
        "engine": engine,
        "weights_loaded": weights_loaded,
        "fallback": fallback
    }
