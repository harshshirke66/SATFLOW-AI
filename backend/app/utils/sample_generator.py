import cv2
import numpy as np
import math
from app.config import SAMPLE_DIR

def draw_cyclone(width=512, height=512, center=(256, 256), angle_offset=0.0) -> np.ndarray:
    """Generates a synthetic satellite image of a cyclone cloud spiral."""
    # Dark blue ocean background
    img = np.zeros((height, width, 3), dtype=np.uint8)
    img[:, :] = [40, 20, 10]  # Dark blue-gray ocean in BGR
    
    # Draw some Earth land mass green/brown shapes in background
    cv2.ellipse(img, (100, 100), (80, 50), 30, 0, 360, (20, 45, 25), -1)
    cv2.ellipse(img, (450, 380), (120, 80), -15, 0, 360, (25, 55, 30), -1)
    
    # Smooth land boundaries
    img = cv2.GaussianBlur(img, (25, 25), 0)
    
    # Create cloud overlay canvas
    clouds = np.zeros((height, width), dtype=np.float32)
    
    # Generate spiral cloud arms
    cx, cy = center
    num_arms = 3
    for arm in range(num_arms):
        arm_angle = arm * (2 * math.pi / num_arms) + angle_offset
        # Draw puff elements along the spiral arm
        for r in range(10, 220, 4):
            # Spiral formula: angle increases with radius
            theta = arm_angle + (r / 50.0)
            px = int(cx + r * math.cos(theta))
            py = int(cy + r * math.sin(theta))
            
            if 0 <= px < width and 0 <= py < height:
                # Cloud puff size decreases slightly at edges
                radius = int(25 - (r * 0.08))
                radius = max(5, radius)
                # Cloud brightness/opacity
                opacity = max(0.1, 1.0 - (r / 240.0))
                
                # Draw a soft radial cloud puff
                # Create a local grid for the cloud puff
                x_grid = np.arange(px - radius, px + radius)
                y_grid = np.arange(py - radius, py + radius)
                
                # Clip to image boundaries
                x_grid = x_grid[(x_grid >= 0) & (x_grid < width)]
                y_grid = y_grid[(y_grid >= 0) & (y_grid < height)]
                
                if len(x_grid) > 0 and len(y_grid) > 0:
                    yy, xx = np.meshgrid(y_grid, x_grid, indexing='ij')
                    dist_sq = (xx - px)**2 + (yy - py)**2
                    puff = np.exp(-dist_sq / (2 * (radius/2)**2)) * opacity
                    clouds[yy, xx] = np.maximum(clouds[yy, xx], puff)

    # Blur clouds to make them look soft and continuous
    clouds = cv2.GaussianBlur(clouds, (15, 15), 0)
    
    # Convert clouds to BGR white overlay
    clouds_rgb = np.dstack([clouds, clouds, clouds]) * 255.0
    clouds_rgb = clouds_rgb.astype(np.uint8)
    
    # Blend clouds onto background image
    alpha = np.dstack([clouds, clouds, clouds])
    blended = (img.astype(float) * (1.0 - alpha) + clouds_rgb.astype(float) * alpha).astype(np.uint8)
    
    return blended

def generate_default_samples():
    """Generates cloud_A.png and cloud_B.png in sample_data directory if they don't exist."""
    path_a = SAMPLE_DIR / "cloud_A.png"
    path_b = SAMPLE_DIR / "cloud_B.png"
    
    if not path_a.exists():
        # Cyclone at 230, 230
        img_a = draw_cyclone(center=(230, 230), angle_offset=0.0)
        cv2.imwrite(str(path_a), img_a)
        print(f"[Sample] Generated {path_a}")
        
    if not path_b.exists():
        # Cyclone has moved southeast to 270, 270 and rotated slightly
        img_b = draw_cyclone(center=(270, 270), angle_offset=0.25)
        cv2.imwrite(str(path_b), img_b)
        print(f"[Sample] Generated {path_b}")
