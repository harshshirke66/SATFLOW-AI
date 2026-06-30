# 🛰️ SATFLOW AI – Satellite Temporal Super-Resolution

**SATFLOW AI** is a production-grade software platform designed to enhance the temporal resolution of satellite imagery using deep learning and dense optical flow estimation. The project solves the ISRO Bharatiya Antariksh Hackathon challenge of synthesizing intermediate satellite frames between consecutive geostationary passes (like INSAT-3D/3DR), enabling disaster mitigation agencies to continuously monitor rapid, volatile weather events without launching expensive physical payloads.

> [!IMPORTANT]
> **Hackathon Team**: ByteBots
> * **Team Leader & AI Lead**: Harsh Shirke
> * **Architect**: Devansh Pandey
> * **Computer Vision Research**: Deepa Choudhary
> * **Meteorological Analyst**: Aditi Deshmukh

---

## 🎨 Premium Handcrafted UI Features

The user interface has been designed from scratch to feel like a high-end mission control console, adopting the latest visual patterns used by Stripe, Linear, and Vercel.

*   **📺 Solid Pitch-Black Canvas**: The entire app background is synchronized to a uniform `#000000` pitch-black canvas, overlaying subtle tech-grid grids and fine-grain film noise to make glowing glassmorphic elements pop with maximum contrast.
*   **📡 Orbit Telemetry Status Widget**: A custom floating client-side widget in the bottom-left corner that replicates the official SATFLOW orbiting logo. It polls `GET /health` in the background, displaying real-time API connectivity, GPU CUDA availability, and the active interpolation engine.
*   **🍱 Asymmetric Bento Grid**: The target hazard areas (Cyclones, Floods, Convective Storms, Cloud Layers, and Wildfires) are arranged in an organic Bento Grid layout with responsive card sizing and monospace metadata labels.
*   **👥 Radar HUD Team Avatars**: The About page displays the ByteBots team cards with grayscale-to-color hover transitions and a slowly rotating outer dashed HUD tracking ring simulating satellite radar sweep lines.
*   **🗺️ Numbered Step Roadmap**: Features a 3-column numbered card layout (`01`, `02`, `03`) mapping our implementation and deployment pipeline with ISRO.

---

## 🛠️ Key Technical Features

1.  **AI Frame Interpolation**: Implements the pre-trained **RIFE (Real-Time Intermediate Flow Estimation)** model architecture with arbitrary temporal steps ($t \in (0, 1)$) to generate 1, 3, or 5 intermediate observation frames.
2.  **Robust Classical Fallback**: Incorporates a **Farneback Dense Optical Flow warping baseline** that executes automatically if RIFE weights are missing or if CUDA resources are unavailable.
3.  **Motion Vector Overlays**: Computes dense flow vectors and overlays motion arrows displaying cloud velocities and storm spin direction.
4.  **Change Intensity Heatmaps**: Generates differential visual heatmaps using colormaps to highlight changing cyclone centers, expanding flood zones, and fire plume expansions.
5.  **Interactive Workstation**: Includes a drag-to-compare swipe slider (Before/After), zoom controls ($1\times$ to $3\times$), timeline scrubbing playback, and live quality metric benchmarks (PSNR / SSIM).

---

## 📂 Project Structure

```
satflow-ai/
│
├── DEPLOYMENT.md           # Step-by-step production hosting guide (Vercel & Render)
├── README.md               # Main repository documentation
│
├── frontend/
│   ├── app/                # Next.js 15 App router (landing, dashboard, architecture, about)
│   ├── components/         # Reusable React components (Globe, Slider, Timeline, TelemetryWidget)
│   ├── public/             # Static frontend assets (Team photos, favicons)
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
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
*   **Python**: v3.9 to v3.11 recommended.
*   **Node.js**: v18.0 or newer.
*   **Git**: Installed and configured.

### 2. Backend Setup
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: Requirements include `fastapi`, `uvicorn`, `opencv-python`, `torch`, `torchvision`, `numpy`, and `pillow`.*
3. **Model Checkpoint (flownet.pkl)**:
   The backend automatically downloads the compatible RIFE model weights on startup if they are missing from `model/rife/train_log/flownet.pkl`.
4. Test the backend services:
   ```bash
   python test_backend.py
   ```
   All test cases should return `[OK]`.
5. Run the FastAPI development server:
   ```bash
   python run.py
   ```
   The backend API will run on `http://localhost:8000`. You can inspect the OpenAPI docs at `http://localhost:8000/docs`.

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

## 🔗 Production Deployment

To host this application in a live production environment, see our detailed **[Deployment Guide (DEPLOYMENT.md)](file:///d:/ISRO%20HACKATHON/DEPLOYMENT.md)**. It covers:
*   Setting up **Vercel** for Next.js.
*   Deploying the **FastAPI** web service on **Render** (CPU fallback).
*   Configuring GPU nodes (AWS EC2 / RunPod) for full CUDA acceleration.
