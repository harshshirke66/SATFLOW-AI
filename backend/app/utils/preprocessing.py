import torch
import torch.nn.functional as F
import numpy as np

def preprocess_frame(img_bgr: np.ndarray, device: str) -> tuple[torch.Tensor, tuple[int, int, int, int]]:
    """
    Preprocesses a BGR numpy image:
    1. Converts BGR to RGB (optional, though RIFE uses standard RGB/BGR, we preserve channel order).
    2. Normalizes to [0, 1].
    3. Converts to PyTorch Tensor: [1, C, H, W].
    4. Pads H and W to be multiples of 32.
    
    Returns:
        padded_tensor: torch.Tensor
        padding_info: (h, w, pad_h, pad_w) for unpadding later.
    """
    h, w, c = img_bgr.shape
    
    # RIFE typically processes channels as float32 in [0, 1] range
    # Transpose channels: (H, W, C) -> (C, H, W)
    img_tensor = torch.from_numpy(img_bgr.transpose(2, 0, 1)).float().to(device) / 255.0
    img_tensor = img_tensor.unsqueeze(0) # [1, C, H, W]
    
    # Calculate padding
    ph = ((h - 1) // 32 + 1) * 32
    pw = ((w - 1) // 32 + 1) * 32
    pad_h = ph - h
    pad_w = pw - w
    
    # padding format: (left, right, top, bottom)
    padding = (0, pad_w, 0, pad_h)
    padded_tensor = F.pad(img_tensor, padding)
    
    return padded_tensor, (h, w, pad_h, pad_w)

def postprocess_tensor(tensor: torch.Tensor, h: int, w: int) -> np.ndarray:
    """
    Postprocesses a RIFE output tensor:
    1. Clips values to [0, 1].
    2. Multiplies by 255 and converts to uint8.
    3. Crops back to the original size [h, w].
    4. Converts back to a BGR numpy array [H, W, C].
    """
    # [1, C, H, W] -> [C, H, W]
    img = tensor.clamp(0.0, 1.0)
    img_np = (img[0] * 255.0).byte().cpu().numpy()
    
    # Transpose back: (C, H, W) -> (H, W, C)
    img_np = img_np.transpose(1, 2, 0)
    
    # Crop to original size
    cropped = img_np[:h, :w, :]
    return cropped
