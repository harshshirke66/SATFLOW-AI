from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import time
from app.utils.image_loader import load_image_from_bytes
from app.services.metrics import calculate_psnr, calculate_ssim, estimate_lpips

router = APIRouter()

@router.post("")
async def evaluate_metrics(
    generated_frame: UploadFile = File(...),
    reference_frame: UploadFile = File(None)
):
    """
    Evaluates quality metrics (PSNR, SSIM, LPIPS estimation) for a generated frame.
    If reference_frame is provided, compares the generated frame against it.
    """
    start_time = time.time()
    try:
        gen_bytes = await generated_frame.read()
        gen_img = load_image_from_bytes(gen_bytes)
        
        if reference_frame is None:
            # If reference is missing, return trivial self-metrics
            return {
                "psnr": 100.0,
                "ssim": 1.0,
                "lpips": 0.0,
                "note": "Reference frame was not provided. Comparing generated frame with itself.",
                "evaluation_time_ms": round((time.time() - start_time) * 1000, 2)
            }
            
        ref_bytes = await reference_frame.read()
        ref_img = load_image_from_bytes(ref_bytes)
        
        # Calculate metrics
        psnr_val = calculate_psnr(ref_img, gen_img)
        ssim_val = calculate_ssim(ref_img, gen_img)
        lpips_val = estimate_lpips(ssim_val)
        
        return {
            "psnr": round(psnr_val, 2) if psnr_val != float('inf') else 99.9,
            "ssim": round(ssim_val, 4),
            "lpips": lpips_val,
            "evaluation_time_ms": round((time.time() - start_time) * 1000, 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error computing metrics: {str(e)}")
