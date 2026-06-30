import cv2
import numpy as np

def warp_flow(img: np.ndarray, flow: np.ndarray) -> np.ndarray:
    """Warps an image based on dense optical flow vectors using cv2.remap."""
    h, w = flow.shape[:2]
    # Create grid mapping
    grid_x, grid_y = np.meshgrid(np.arange(w), np.arange(h))
    
    # Displace map coordinates by the flow vectors
    map_x = (grid_x + flow[..., 0]).astype(np.float32)
    map_y = (grid_y + flow[..., 1]).astype(np.float32)
    
    # Remap image pixels using bilinear interpolation
    warped = cv2.remap(img, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    return warped

def classical_flow_interpolate(img0: np.ndarray, img1: np.ndarray, num_frames: int = 1) -> list[np.ndarray]:
    """
    Classical interpolation using Farneback Optical Flow.
    Estimates intermediate frames by warping img0 forward and img1 backward,
    then blending them based on temporal progress.
    """
    gray0 = cv2.cvtColor(img0, cv2.COLOR_BGR2GRAY)
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    
    # Compute dense optical flow
    # parameters: pyr_scale, levels, winsize, iterations, poly_n, poly_sigma, flags
    flow_fw = cv2.calcOpticalFlowFarneback(gray0, gray1, None, 0.5, 3, 15, 3, 5, 1.2, 0)
    flow_bw = cv2.calcOpticalFlowFarneback(gray1, gray0, None, 0.5, 3, 15, 3, 5, 1.2, 0)
    
    step = 1.0 / (num_frames + 1)
    timesteps = [step * (i + 1) for i in range(num_frames)]
    
    generated_frames = []
    for t in timesteps:
        # Scale flow vectors linearly based on time fraction
        warped0 = warp_flow(img0, t * flow_fw)
        warped1 = warp_flow(img1, (1.0 - t) * flow_bw)
        
        # Blend warped frames: weight img0 decreases, img1 increases
        blended = cv2.addWeighted(warped0, 1.0 - t, warped1, t, 0.0)
        generated_frames.append(blended.astype(np.uint8))
        
    return generated_frames

def draw_optical_flow_vectors(img0: np.ndarray, img1: np.ndarray, step: int = 16) -> np.ndarray:
    """
    Computes optical flow between img0 and img1 and returns an image with
    superimposed vector arrows showing direction and magnitude of motion.
    """
    gray0 = cv2.cvtColor(img0, cv2.COLOR_BGR2GRAY)
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    
    flow = cv2.calcOpticalFlowFarneback(gray0, gray1, None, 0.5, 3, 15, 3, 5, 1.2, 0)
    
    vis = img0.copy()
    h, w = img0.shape[:2]
    
    # Generate sampling grid
    y, x = np.mgrid[step//2:h:step, step//2:w:step].reshape(2, -1).astype(int)
    fx, fy = flow[y, x].T
    
    # Draw vector arrows
    for cx, cy, cfx, cfy in zip(x, y, fx, fy):
        mag = np.hypot(cfx, cfy)
        # Only draw arrows with noticeabe motion, filter noise and extreme errors
        if mag > 1.5:
            # Scale arrow length slightly for visibility
            scale = 1.5
            end_x = int(cx + cfx * scale)
            end_y = int(cy + cfy * scale)
            
            # Clamp arrow destinations to screen boundaries
            end_x = max(0, min(w - 1, end_x))
            end_y = max(0, min(h - 1, end_y))
            
            # Color based on magnitude (blue to green/red in BGR)
            # Use cyan/green arrows for a premium dark theme aesthetic
            color = (255, 230, 0) if mag > 5.0 else (0, 255, 120)
            cv2.arrowedLine(
                vis, 
                (int(cx), int(cy)), 
                (end_x, end_y), 
                color, 
                thickness=1, 
                line_type=cv2.LINE_AA, 
                tipLength=0.25
            )
            
    return vis
