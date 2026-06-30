# SATFLOW AI – Satellite Temporal Super-Resolution

**SATFLOW AI** is a production-quality software platform designed to enhance the temporal resolution of satellite imagery using AI/ML-based optical flow estimation. The project solves the ISRO Bharatiya Antariksh Hackathon challenge of synthesizing intermediate satellite frames between consecutive passes, allowing continuous monitoring of rapid atmospheric events without launching extra physical payloads.

---

## Key Features

1. **AI Frame Interpolation**: Implements the pre-trained **RIFE (Real-Time Intermediate Flow Estimation)** model architecture with arbitrary temporal steps ($t \in (0, 1)$) to generate 1, 3, or 5 realistic intermediate frames.
2. **Robust Classical Fallback**: Incorporates a **Farneback Dense Optical Flow warping baseline** that executes automatically if RIFE weights are missing or if CUDA resources are unavailable.
3. **Motion Vector Overlays**: Computes dense flow vectors and overlays motion arrows displaying cloud velocities and storm spin direction.
4. **Change Intensity Heatmaps**: Generates differential visual heatmaps using colormaps to highlight changing cyclone centers, expanding flood zones, and fire plume expansions.
5. **Interactive UI/UX**:
   - **Interactive Globe**: Dynamic 3D perspective wireframe globe with satellite orbits built on lightweight Canvas API.
   - **Timeline Scrubbing**: Frame-by-frame play/pause and looping playback controller.
   - **Split Image Slider**: Drag-to-compare swipe slider with interactive zoom (1x to 3x) and fullscreen capabilities.
   - **Architecture Graph**: Flowchart of operations matching mathematics and code references.

---

## Project Structure

```
satflow-ai/
│
├── frontend/
│   ├── app/                # Next.js 15 App router (pages: landing, dashboard, architecture, about)
│   ├── components/         # Reusable React components (Globe, Slider, Timeline)
│   ├── public/             # Static frontend assets
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts  # Tailwind CSS config
│
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI app initializer & CORS config
│   │   ├── config.py       # Path management & default configurations
│   │   ├── routes/         # Endpoint definitions (generate, metrics, health)
│   │   ├── services/       # Core engines (rife_inference, optical_flow, metrics, heatmap)
│   │   └── utils/          # Auxiliary files (image_loader, preprocessing, file_handler)
│   ├── model/
│   │   └── rife/           # Cloned ECCV2022-RIFE model repository
│   ├── outputs/            # Static static-mounted directory for rendered images
│   ├── sample_data/        # Generated synthetic cyclone frames (cloud_A & cloud_B)
│   ├── requirements.txt    # Python library dependencies
│   ├── run.py              # Server run entrypoint
│   └── test_backend.py     # Independent backend validation suite
│
└── README.md
```

---

## Installation & Setup Guide

### 1. Prerequisites
- **Python**: v3.9 to v3.11 recommended.
- **Node.js**: v18.0 or newer.
- **Git**: Installed and accessible in command-line.

### 2. Backend Setup
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```

2. The RIFE model has already been cloned into `model/rife`.
   *(Manual command: `git clone https://github.com/hzwer/ECCV2022-RIFE.git model/rife`)*

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
   *Required packages: `fastapi`, `uvicorn`, `python-multipart`, `opencv-python`, `torch`, `torchvision`, `numpy`, `pillow`, `gdown`.*

4. **Model Checkpoint (flownet.pkl)**:
   The backend automatically downloads the compatible RIFE model weights on startup if they are missing from `model/rife/train_log/flownet.pkl`.
   If the download fails, the API will output warning logs and gracefully fall back to the Farneback classical optical flow warping engine.

5. Test the backend services:
   ```bash
   python test_backend.py
   ```
   All test cases should return `[OK]`.

6. Run the FastAPI development server:
   ```bash
   python run.py
   ```
   The backend API will run on `http://localhost:8000`. You can inspect the interactive OpenAPI docs at `http://localhost:8000/docs`.

### 3. Frontend Setup
1. Navigate to the `frontend/` folder:
   ```bash
   cd ../frontend
   ```

2. Install Node packages:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   The user interface will be active on `http://localhost:3000`.

---

## API Documentation

### 1. `POST /generate`
Generates intermediate temporal frames.
- **Inputs (Multipart Form)**:
  - `frameA`: First satellite pass image file.
  - `frameB`: Second satellite pass image file.
  - `number_of_frames`: Integer (`1`, `3`, or `5`).
  - `model_type`: String (`"rife"` or `"optical_flow"`).
- **Output**: JSON object listing the sequence of frames, static image URLs, flow visualization URLs, and difference heatmap URLs.

### 2. `POST /metrics`
Computes quality values between a generated frame and reference ground truth.
- **Inputs (Multipart Form)**:
  - `generated_frame`: The synthesized image file.
  - `reference_frame`: The actual ground truth pass (optional).
- **Output**: JSON with `psnr`, `ssim`, and estimated `lpips` scores.

### 3. `GET /health`
Returns system diagnosis.
- **Output**: JSON with GPU availability, device name, and RIFE loaded status.

### 4. `GET /generate/samples`
Serves pre-rendered cyclone simulation files.
- **Output**: JSON with base64 strings of `frameA` and `frameB`.

---

## Future Scope

- **INSAT payload integration**: Fine-tune RIFE weights directly using MOSDAC thermal infrared and water-vapor channel feeds.
- **VEDAS Deployment**: Containerize the FastAPI/Next.js stack into Docker and deploy on ISRO's private cloud infrastructure.
- **Fluid Dynamic Regularization**: Augment the pixel warp loss function with meteorological constraints (e.g. conservation of mass/vorticity).
