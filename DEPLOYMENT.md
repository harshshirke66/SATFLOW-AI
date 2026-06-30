# SATFLOW AI – Deployment Guide

This document describes how to deploy the SATFLOW AI framework for production. The application consists of two components:
1. **Backend Server**: FastAPI Python API (handles optical flow interpolation, image rendering, and metric evaluation).
2. **Frontend Dashboard**: Next.js Web Application (provides the workstation user interface).

---

## 📡 1. Backend Deployment (FastAPI)

The backend can be deployed either on CPU-only hosting (Render, Railway) or GPU-enabled hosting (RunPod, AWS, Paperspace) for hardware CUDA-accelerated neural networks.

### Option A: CPU Deployment (Free / Budget Tier)
This runs the classical Farneback baseline. You can host it easily on **Render** or **Railway**.

#### Render Deployment Steps:
1. Sign up on [Render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository `harshshirke66/SATFLOW-AI`.
3. Configure the following settings:
   * **Root Directory**: `backend`
   * **Runtime**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add:
   * `PORT`: `8000`
5. Click **Deploy Web Service**. Render will assign you a public URL (e.g., `https://satflow-backend.onrender.com`).

---

### Option B: GPU Deployment (Recommended for Neural RIFE v3)
To enable CUDA GPU acceleration, rent a cloud GPU instance on **AWS (g4dn instance)**, **RunPod**, or **Paperspace**.

#### Deployment Steps on a VPS / GPU Node:
1. Provision a Linux VM with NVIDIA Drivers and CUDA installed.
2. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com/harshshirke66/SATFLOW-AI.git
   cd SATFLOW-AI/backend
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server under a process manager like `pm2` or `systemd` to keep it running in the background:
   ```bash
   # Using PM2 (requires Node.js)
   pm2 start "python run.py" --name satflow-backend
   ```
5. Expose port `8000` and configure your firewall to allow incoming traffic to `http://your-server-ip:8000`.

---

## 💻 2. Frontend Deployment (Next.js)

The frontend is fully optimized for **Vercel**, which is the creators of Next.js and provides free global CDN hosting.

### Vercel Deployment Steps:
1. Log in to [Vercel.com](https://vercel.com) and click **Add New** > **Project**.
2. Import the Git repository `harshshirke66/SATFLOW-AI`.
3. Configure the Project settings:
   * **Framework Preset**: `Next.js`
   * **Root Directory**: `frontend` (Click Edit, select `frontend`, and click Continue)
4. Under **Environment Variables**, add the API link pointing to your deployed Backend URL:
   * **Name**: `NEXT_PUBLIC_API_URL`
   * **Value**: `https://your-deployed-backend-url.com` (Do not include a trailing slash)
5. Click **Deploy**. Vercel will compile the assets and provide you with a production-ready HTTPS URL (e.g., `https://satflow-ai.vercel.app`).

---

## 🔗 Connecting Frontend and Backend

Once both applications are deployed:
1. In your **Vercel** project settings, make sure the environment variable `NEXT_PUBLIC_API_URL` matches your deployed **FastAPI** URL.
2. In your **FastAPI Backend**, the CORS configuration in `backend/app/main.py` is configured to allow all origins (`allow_origins=["*"]`), which guarantees that your frontend can fetch inference streams across domains with no CORS issues.
