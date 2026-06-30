from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import time
import uuid
import numpy as np
import cv2
from app.utils.image_loader import load_image_from_bytes
from app.utils.file_handler import save_output_image, cleanup_old_files
from app.services.rife_inference import rife_interpolate
from app.services.optical_flow import classical_flow_interpolate, draw_optical_flow_vectors
from app.services.heatmap import generate_difference_heatmap
from app.services.metrics import calculate_psnr, calculate_ssim, estimate_lpips

router = APIRouter()

@router.post("")
async def generate_frames(
    frameA: UploadFile = File(...),
    frameB: UploadFile = File(...),
    number_of_frames: int = Form(1),
    model_type: str = Form("rife")  # "rife" or "optical_flow"
):
    """
    Generates N intermediate satellite frames between frameA and frameB.
    Computes optical flow vectors and heatmaps for each frame step.
    """
    start_time = time.time()
    
    # Run a quick background cleanup of files older than 30 minutes
    cleanup_old_files(1800)
    
    if number_of_frames not in [1, 3, 5]:
        raise HTTPException(status_code=400, detail="Only 1, 3, or 5 intermediate frames are supported.")
        
    try:
        # 1. Read files and load images
        bytes_a = await frameA.read()
        bytes_b = await frameB.read()
        
        img_a = load_image_from_bytes(bytes_a)
        img_b = load_image_from_bytes(bytes_b)
        
        h, w, c = img_a.shape
        
        # Ensure frameB has the exact same dimensions as frameA
        if img_b.shape != img_a.shape:
            img_b = cv2.resize(img_b, (w, h))
            
        # 2. Run Interpolation
        generated_frames = []
        model_used = model_type
        
        if model_type == "rife":
            try:
                print(f"[Generate] Attempting RIFE interpolation for {number_of_frames} frames...")
                generated_frames = rife_interpolate(img_a, img_b, number_of_frames)
                model_used = "rife"
            except Exception as e:
                print(f"[Generate] RIFE interpolation failed: {e}. Falling back to Classical Optical Flow...")
                generated_frames = classical_flow_interpolate(img_a, img_b, number_of_frames)
                model_used = "optical_flow_fallback"
        else:
            print(f"[Generate] Running Classical Farneback Optical Flow interpolation for {number_of_frames} frames...")
            generated_frames = classical_flow_interpolate(img_a, img_b, number_of_frames)
            model_used = "optical_flow"
            
        # 3. Assemble complete timeline: [Frame A, Inter1, Inter2, ..., Frame B]
        full_sequence = [img_a] + generated_frames + [img_b]
        num_total_frames = len(full_sequence)
        
        # 4. Generate visual outputs and save files
        # We assign a session ID to group these frames
        session_id = str(uuid.uuid4())[:8]
        
        response_frames = []
        
        # Base time interval labels (e.g. 10:00 -> 10:05 -> 10:10)
        # We step 5 minutes per frame
        for i, frame in enumerate(full_sequence):
            frame_idx = i
            is_ai = (i > 0 and i < num_total_frames - 1)
            time_offset_mins = i * 5
            timestamp = f"10:{time_offset_mins:02d}"
            if is_ai:
                timestamp += " (AI)"
                
            # Save raw frame
            frame_filename = f"{session_id}_frame_{frame_idx}.png"
            image_url = save_output_image(frame, frame_filename)
            
            # Compute optical flow to the NEXT frame (for the last frame, wrap back or copy previous)
            flow_vis_filename = f"{session_id}_flow_{frame_idx}.png"
            if i < num_total_frames - 1:
                flow_vis = draw_optical_flow_vectors(frame, full_sequence[i + 1], step=24)
            else:
                # Last frame flow points backward or is zeroed
                flow_vis = draw_optical_flow_vectors(full_sequence[i - 1], frame, step=24)
            flow_url = save_output_image(flow_vis, flow_vis_filename)
            
            # Compute difference heatmap to the NEXT frame
            heatmap_filename = f"{session_id}_heatmap_{frame_idx}.png"
            if i < num_total_frames - 1:
                heatmap_vis = generate_difference_heatmap(frame, full_sequence[i + 1], alpha=0.4)
            else:
                heatmap_vis = generate_difference_heatmap(full_sequence[i - 1], frame, alpha=0.4)
            heatmap_url = save_output_image(heatmap_vis, heatmap_filename)
            
            response_frames.append({
                "index": frame_idx,
                "timestamp": timestamp,
                "is_ai": is_ai,
                "image_url": image_url,
                "flow_url": flow_url,
                "heatmap_url": heatmap_url
            })
            
        # 5. Compute metrics (between Frame A and Frame B as comparison, and middle generated frame)
        # Linear cross-fade blend of A and B as a simple baseline reference
        middle_idx = num_total_frames // 2
        middle_gen = full_sequence[middle_idx]
        
        linear_blend = cv2.addWeighted(img_a, 0.5, img_b, 0.5, 0.0)
        
        # Calculate how much better RIFE/Flow is compared to simple blending (vs Ground Truth, or simply reporting characteristics)
        # Let's compare the generated frame against Frame A and Frame B
        psnr_val = calculate_psnr(img_a, middle_gen)
        ssim_val = calculate_ssim(img_a, middle_gen)
        lpips_val = estimate_lpips(ssim_val)
        
        inference_time_ms = round((time.time() - start_time) * 1000, 2)
        
        return {
            "success": True,
            "inference_time_ms": inference_time_ms,
            "model_used": model_used,
            "metrics": {
                "psnr": round(psnr_val, 2),
                "ssim": round(ssim_val, 4),
                "lpips": lpips_val,
                "frames_generated": number_of_frames
            },
            "frames": response_frames
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.get("/samples")
def get_samples():
    """Returns base64 encoded strings for default sample images."""
    from app.utils.image_loader import read_image_as_base64
    from app.config import SAMPLE_DIR
    from app.utils.sample_generator import generate_default_samples
    
    path_a = SAMPLE_DIR / "cloud_A.png"
    path_b = SAMPLE_DIR / "cloud_B.png"
    
    # Make sure samples are generated
    generate_default_samples()
    
    try:
        return {
            "frameA_b64": read_image_as_base64(str(path_a)),
            "frameB_b64": read_image_as_base64(str(path_b))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load sample images: {str(e)}")
