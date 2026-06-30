import cv2
import numpy as np
import math
import shutil
from pathlib import Path
from app.config import SAMPLE_DIR

def draw_cyclone_fallback(width=512, height=512, center=(256, 256), angle_offset=0.0) -> np.ndarray:
    """Generates a synthetic satellite image of a cyclone cloud spiral (fallback)."""
    img = np.zeros((height, width, 3), dtype=np.uint8)
    img[:, :] = [40, 20, 10]  # Dark blue-gray ocean
    
    cv2.ellipse(img, (100, 100), (80, 50), 30, 0, 360, (20, 45, 25), -1)
    cv2.ellipse(img, (450, 380), (120, 80), -15, 0, 360, (25, 55, 30), -1)
    img = cv2.GaussianBlur(img, (25, 25), 0)
    
    clouds = np.zeros((height, width), dtype=np.float32)
    cx, cy = center
    num_arms = 3
    for arm in range(num_arms):
        arm_angle = arm * (2 * math.pi / num_arms) + angle_offset
        for r in range(10, 220, 4):
            theta = arm_angle + (r / 50.0)
            px = int(cx + r * math.cos(theta))
            py = int(cy + r * math.sin(theta))
            
            if 0 <= px < width and 0 <= py < height:
                radius = int(25 - (r * 0.08))
                radius = max(5, radius)
                opacity = max(0.1, 1.0 - (r / 240.0))
                
                x_grid = np.arange(px - radius, px + radius)
                y_grid = np.arange(py - radius, py + radius)
                x_grid = x_grid[(x_grid >= 0) & (x_grid < width)]
                y_grid = y_grid[(y_grid >= 0) & (y_grid < height)]
                
                if len(x_grid) > 0 and len(y_grid) > 0:
                    yy, xx = np.meshgrid(y_grid, x_grid, indexing='ij')
                    dist_sq = (xx - px)**2 + (yy - py)**2
                    puff = np.exp(-dist_sq / (2 * (radius/2)**2)) * opacity
                    clouds[yy, xx] = np.maximum(clouds[yy, xx], puff)

    clouds = cv2.GaussianBlur(clouds, (15, 15), 0)
    clouds_rgb = np.dstack([clouds, clouds, clouds]) * 255.0
    clouds_rgb = clouds_rgb.astype(np.uint8)
    alpha = np.dstack([clouds, clouds, clouds])
    blended = (img.astype(float) * (1.0 - alpha) + clouds_rgb.astype(float) * alpha).astype(np.uint8)
    return blended

def generate_default_samples():
    """
    Generates cloud_A.png and cloud_B.png in sample_data directory.
    Uses the real satellite source image by applying 1.8-degree cyclonic rotation
    and a translation shift before cropping, simulating actual geostationary frames.
    Falls back to synthetic drawing if the source image is missing.
    """
    path_a = SAMPLE_DIR / "cloud_A.png"
    path_b = SAMPLE_DIR / "cloud_B.png"
    source_workspace_path = SAMPLE_DIR / "real_satellite_source.png"
    
    # 1. Check if source image needs to be copied from brain directory
    if not source_workspace_path.exists():
        brain_source = Path(r"C:\Users\DELL\.gemini\antigravity-ide\brain\5a5c22d5-7f8c-4a34-b8af-2180afb241e4\real_satellite_source_1782832701290.png")
        if brain_source.exists():
            try:
                shutil.copy(str(brain_source), str(source_workspace_path))
                print(f"[Sample] Copied real satellite source from brain to {source_workspace_path}")
            except Exception as e:
                print(f"[Sample] Error copying source file: {e}")
                
    # 2. Check if we can proceed with real satellite cropping
    if source_workspace_path.exists():
        try:
            img = cv2.imread(str(source_workspace_path))
            if img is not None:
                h, w, c = img.shape
                
                # Crop Frame A: 512x512 at the center
                cx, cy = w // 2, h // 2
                size = 512
                x0 = cx - size // 2
                y0 = cy - size // 2
                img_a = img[y0:y0+size, x0:x0+size]
                
                # Frame B: apply 1.8-degree rotation (cyclonic spin)
                # and shift coordinates by +10px X and +8px Y (wind translation)
                angle = 1.8
                rot_matrix = cv2.getRotationMatrix2D((cx, cy), angle, 1.0)
                rotated_img = cv2.warpAffine(img, rot_matrix, (w, h), borderMode=cv2.BORDER_REPLICATE)
                
                bx0 = x0 + 10
                by0 = y0 + 8
                img_b = rotated_img[by0:by0+size, bx0:bx0+size]
                
                cv2.imwrite(str(path_a), img_a)
                cv2.imwrite(str(path_b), img_b)
                print(f"[Sample] Successfully generated REAL satellite imagery examples: {path_a} and {path_b}")
                return
        except Exception as e:
            print(f"[Sample] Processing real satellite image failed ({e}). Falling back to synthetic...")
            
    # 3. Fallback: Generate synthetic cloud spiral images
    if not path_a.exists():
        img_a = draw_cyclone_fallback(center=(230, 230), angle_offset=0.0)
        cv2.imwrite(str(path_a), img_a)
        print(f"[Sample] Generated synthetic cloud_A.png fallback")
        
    if not path_b.exists():
        img_b = draw_cyclone_fallback(center=(270, 270), angle_offset=0.25)
        cv2.imwrite(str(path_b), img_b)
        print(f"[Sample] Generated synthetic cloud_B.png fallback")
