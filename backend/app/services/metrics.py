import cv2
import numpy as np

def calculate_psnr(img1: np.ndarray, img2: np.ndarray) -> float:
    """Calculates Peak Signal-to-Noise Ratio (PSNR) between two BGR images."""
    if img1.shape != img2.shape:
        img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))
    return float(cv2.PSNR(img1, img2))

def calculate_ssim(img1: np.ndarray, img2: np.ndarray) -> float:
    """
    Calculates Structural Similarity Index (SSIM) between two BGR images.
    Implements the standard SSIM formula using Gaussian filters for speed and independence.
    """
    if img1.shape != img2.shape:
        img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))
        
    x = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY).astype(np.float64)
    y = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY).astype(np.float64)
    
    # Constants for stability
    k1, k2 = 0.01, 0.03
    l = 255 # Dynamic range
    c1 = (k1 * l) ** 2
    c2 = (k2 * l) ** 2
    
    # Means
    mu_x = cv2.GaussianBlur(x, (11, 11), 1.5)
    mu_y = cv2.GaussianBlur(y, (11, 11), 1.5)
    
    mu_x_sq = mu_x ** 2
    mu_y_sq = mu_y ** 2
    mu_xy = mu_x * mu_y
    
    # Variances and Covariance
    sigma_x_sq = cv2.GaussianBlur(x ** 2, (11, 11), 1.5) - mu_x_sq
    sigma_y_sq = cv2.GaussianBlur(y ** 2, (11, 11), 1.5) - mu_y_sq
    sigma_xy = cv2.GaussianBlur(x * y, (11, 11), 1.5) - mu_xy
    
    # SSIM equation
    num = (2 * mu_xy + c1) * (2 * sigma_xy + c2)
    den = (mu_x_sq + mu_y_sq + c1) * (sigma_x_sq + sigma_y_sq + c2)
    
    ssim_map = num / den
    return float(np.mean(ssim_map))

def estimate_lpips(ssim_val: float) -> float:
    """
    LPIPS (Learned Perceptual Image Patch Similarity) placeholder estimation.
    Perceptual distance generally correlates inversely with structural similarity.
    0.0 represents identical images, higher represents greater distance.
    """
    # Simple perceptual distance approximation for UI representation
    approx_lpips = max(0.0, (1.0 - ssim_val) * 0.45)
    return round(approx_lpips, 4)
