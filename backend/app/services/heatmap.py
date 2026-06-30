import cv2
import numpy as np

def generate_difference_heatmap(img0: np.ndarray, img1: np.ndarray, alpha: float = 0.5) -> np.ndarray:
    """
    Computes absolute difference between two BGR images, applies a colormap (JET),
    and overlays it onto img0 with opacity (alpha).
    Highlights regions of significant change (e.g., cloud motion, Cyclone expansion).
    """
    # Verify dimensions match
    if img0.shape != img1.shape:
        img1 = cv2.resize(img1, (img0.shape[1], img0.shape[0]))
        
    # Absolute difference
    diff = cv2.absdiff(img0, img1)
    
    # Convert to grayscale
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce high-frequency noise/sensor artifacts
    diff_blur = cv2.GaussianBlur(diff_gray, (9, 9), 0)
    
    # Normalize difference map to 0-255 range for colormap
    diff_norm = cv2.normalize(diff_blur, None, 0, 255, cv2.NORM_MINMAX)
    
    # Apply JET colormap (Red = high change, Blue = no change)
    heatmap = cv2.applyColorMap(diff_norm, cv2.COLORMAP_JET)
    
    # Blend heatmap overlay with original image (img0) for physical reference
    overlay = cv2.addWeighted(img0, 1.0 - alpha, heatmap, alpha, 0.0)
    
    return overlay
