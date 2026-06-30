import os
import sys
import numpy as np
import cv2

# Add current folder to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_tests():
    print("=== SATFLOW AI Backend Test Suite ===")
    
    # 1. Test Imports
    print("\n[Test 1/6] Verifying system imports...")
    try:
        from app.config import SAMPLE_DIR, OUTPUT_DIR
        from app.utils.sample_generator import generate_default_samples
        from app.services.optical_flow import classical_flow_interpolate, draw_optical_flow_vectors
        from app.services.heatmap import generate_difference_heatmap
        from app.services.metrics import calculate_psnr, calculate_ssim
        print("[OK] Imports verified successfully!")
    except Exception as e:
        print(f"[FAIL] Import test failed: {e}")
        sys.exit(1)
        
    # 2. Test Sample Generation
    print("\n[Test 2/6] Verifying sample image generation...")
    try:
        generate_default_samples()
        path_a = SAMPLE_DIR / "cloud_A.png"
        path_b = SAMPLE_DIR / "cloud_B.png"
        
        assert path_a.exists(), "cloud_A.png was not generated"
        assert path_b.exists(), "cloud_B.png was not generated"
        
        img_a = cv2.imread(str(path_a))
        img_b = cv2.imread(str(path_b))
        
        print(f"[OK] Samples generated successfully! Dimensions: {img_a.shape}")
    except Exception as e:
        print(f"[FAIL] Sample generation test failed: {e}")
        sys.exit(1)
        
    # 3. Test Classical Flow Interpolation
    print("\n[Test 3/6] Verifying Farneback Optical Flow interpolation baseline...")
    try:
        interpolated = classical_flow_interpolate(img_a, img_b, num_frames=3)
        assert len(interpolated) == 3, f"Expected 3 frames, got {len(interpolated)}"
        assert interpolated[0].shape == img_a.shape, "Interpolated frame shape mismatch"
        print("[OK] Classical optical flow interpolation works!")
    except Exception as e:
        print(f"[FAIL] Classical interpolation failed: {e}")
        sys.exit(1)
        
    # 4. Test Heatmap & Flow Vector drawings
    print("\n[Test 4/6] Verifying heatmap and flow vector visualizations...")
    try:
        flow_vis = draw_optical_flow_vectors(img_a, img_b, step=16)
        heatmap = generate_difference_heatmap(img_a, img_b)
        
        assert flow_vis.shape == img_a.shape, "Flow vector visualization size mismatch"
        assert heatmap.shape == img_a.shape, "Heatmap overlay size mismatch"
        print("[OK] Visualization renderers working successfully!")
    except Exception as e:
        print(f"[FAIL] Visualizations failed: {e}")
        sys.exit(1)
        
    # 5. Test Quality Metrics
    print("\n[Test 5/6] Verifying PSNR and SSIM computation...")
    try:
        psnr_val = calculate_psnr(img_a, img_b)
        ssim_val = calculate_ssim(img_a, img_b)
        
        print(f"[OK] Metrics calculated: PSNR = {psnr_val:.2f} dB, SSIM = {ssim_val:.4f}")
        assert psnr_val > 0, "Invalid PSNR"
        assert 0.0 <= ssim_val <= 1.0, "SSIM out of bounds"
        print("[OK] Metrics computation is accurate!")
    except Exception as e:
        print(f"[FAIL] Metrics calculation failed: {e}")
        sys.exit(1)
        
    # 6. Test RIFE Neural Inference
    print("\n[Test 6/6] Verifying RIFE Neural Network interpolation...")
    try:
        from app.services.rife_inference import load_rife_model, rife_interpolate
        load_rife_model()
        rife_out = rife_interpolate(img_a, img_b, num_frames=1)
        assert len(rife_out) == 1, "Expected 1 frame output"
        assert rife_out[0].shape == img_a.shape, "RIFE output shape mismatch"
        print("[OK] RIFE Neural Network interpolation works end-to-end!")
    except Exception as e:
        print(f"[FAIL] RIFE Neural Network test failed: {e}")
        sys.exit(1)
        
    print("\n=======================================")
    print("All backend tests completed successfully!")
    print("=======================================")

if __name__ == "__main__":
    run_tests()
