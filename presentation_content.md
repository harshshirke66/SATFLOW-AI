# 🛰️ SATFLOW AI – Presentation Slide Content

This document contains slide-by-slide content ready to be copied directly into your PowerPoint / Google Slides presentation for the **ISRO Bharatiya Antariksh Hackathon**.

---

## 🛝 Slide 1: Opportunity & USP

### ❓ How is it different from existing ideas?
*   **Linear Blending vs. Deep Flow**: Traditional interpolation simply blends pixel opacities, which creates unrealistic "ghosting" or "blurring" of moving cloud layers. SATFLOW AI uses **RIFE v3 (Real-Time Intermediate Flow Estimation)** to dynamically predict pixel movements.
*   **Classical Fallback Safeguard**: Most AI models fail or crash if GPU memory is unavailable. SATFLOW features a hybrid pipeline that automatically switches to an optimized **Farneback Classical Flow** baseline, guaranteeing 100% operational availability on any server.
*   **Not Just Imagery, but Analytics**: Standard image smoothers only make videos. SATFLOW generates **meteorological analytics**—dense cloud velocity vectors and change-intensity heatmaps—directly from the flow fields.

### 🎯 How will it solve the problem?
*   **Temporal Gap Mitigation**: Geostationary satellites (INSAT-3D/3DR) capture observations every 15 to 30 minutes. Rapid weather events (thunderstorms, cyclogenesis) can develop in between passes.
*   **Virtual Super-Resolution**: SATFLOW synthesizes 1, 3, or 5 physically accurate intermediate frames ($t \in (0, 1)$), transforming a sparse 30-minute interval into a continuous **5-minute stream**.
*   **Zero-Hardware Capital Expenditure**: Enhances tracking capabilities entirely in software, saving millions of dollars required to build, launch, and operate additional physical satellite payloads.

### 💎 USP (Unique Selling Proposition)
1.  **Hybrid Flow Architecture**: Combines deep-learning neural flow (precision) with classical fluid-warping algorithms (robustness) in a single pipeline.
2.  **Visual Change Tracking**: Automated generation of change-intensity heatmaps that outline expanding flood zones, storm center displacement, and active wildfire plumes.
3.  **Active Telemetry link**: Seamless dashboard integration showing live GPU/CPU resource load, server connection, and inference model states.

---

## 🛝 Slide 2: Technical Architecture Diagram

*Copy and paste the Mermaid code below into [Mermaid Live](https://mermaid.live) to generate a professional diagram image.*

```mermaid
graph TD
    %% Styling
    classDef input fill:#1e293b,stroke:#475569,stroke-width:2px,color:#fff;
    classDef process fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef neural fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef classical fill:#1c1917,stroke:#fbbf24,stroke-width:2px,color:#fff;
    classDef output fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff;

    %% Ingestion
    subgraph Ingestion["1. Ingestion Layer"]
        A["Satellite Pass T0 (Frame A)"]:::input
        B["Satellite Pass T1 (Frame B)"]:::input
    end

    %% Preprocessing
    subgraph Prep["2. Preprocessing & Alignment"]
        C["Image Padding & Normalization"]:::process
        D["Resolution Rescale & Alignment"]:::process
    end
    A --> C
    B --> D

    %% Flow Engine
    subgraph Engine["3. Hybrid Flow Engine"]
        E{"Resource Check: GPU/CUDA?"}:::process
        F["RIFE v3 (Neural Interpolation)"]:::neural
        G["Farneback (Classical Dense Flow)"]:::classical
    end
    C & D --> E
    E -- "Yes (GPU Active)" --> F
    E -- "No (CPU Fallback)" --> G

    %% Post-processing
    subgraph Post["4. Post-processing & Rendering"]
        H["Motion Vector Generation"]:::process
        I["Differential Change Analysis"]:::process
        J["Temporal Warping Core"]:::process
    end
    F & G --> J
    J --> H
    J --> I

    %% Outputs
    subgraph Out["5. Output Deliverables"]
        K["Synthesized Frames (T=0.25, 0.5, 0.75)"]:::output
        L["Velocity Vector Overlays"]:::output
        M["Change Intensity Heatmaps"]:::output
        N["Validation Metrics (PSNR / SSIM)"]:::output
    end
    J --> K
    H --> L
    I --> M
    J --> N
```

---

## 🛝 Slide 3: List of Features Offered

*   **⚡ Arbitrary Frame Synthesis**: Generate 1, 3, or 5 intermediate satellite frames to increase effective temporal resolution.
*   **🌪️ Cloud Velocity Vectoring**: Computes dense optical flow arrows to track cyclonic rotation speeds, wind direction, and weather fronts.
*   **🔥 Change-Intensity Heatmaps**: Color-coded differential maps highlighting the rate of change in cyclones, flood expansion, and fire plume propagation.
*   **🛡️ Dynamic Dual-Engine Core**: Automatic fallback from RIFE Neural Net (GPU) to OpenCV Farneback (CPU) to ensure zero server downtime.
*   **🛰️ Real-Time Telemetry Link**: Dashboard widget displays active server status, GPU/CPU usage, active model, and network logs.
*   **🔬 Scientific Validation Deck**: Integrated metrics calculator displaying Peak Signal-to-Noise Ratio (PSNR) and Structural Similarity Index (SSIM) between predictions and ground truths.
*   **📱 Fully Responsive Workstation**: Mobile-responsive Bento layout supporting side-by-side comparison swipe-slider, zoom ($1\times$ to $3\times$), and playback timeline.

---

## 🛝 Slide 4: Process Flow & Use-Case Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Weather Analyst / Disaster Agency
    participant Client as Next.js Web Client (Workstation)
    participant API as FastAPI Backend Server
    participant GPU as Inference Engine (RIFE / Flow)

    Operator->>Client: Ingest Satellite Pass T0 and Pass T1
    Operator->>Client: Select Parameters (Frames: 1/3/5, Engine: RIFE/Farneback)
    Client->>API: POST /generate (Multipart Form Data)
    Note over API: Preprocesses images & checks hardware (CPU/GPU)
    API->>GPU: Run Motion Vector and Interpolation Pipeline
    GPU-->>API: Return Interpolated Frames, Vectors & Heatmaps
    Note over API: Computes validation metrics & saves files
    API-->>Client: Response (JSON with URLs & metrics)
    Client->>Operator: Render interactive comparison deck, velocity arrows, and timeline
```

---

## 🛝 Slide 5: Workstation Wireframes & Mock Screens

![SATFLOW AI Workstation Mockup](file:///C:/Users/DELL/.gemini/antigravity-ide/brain/5a5c22d5-7f8c-4a34-b8af-2180afb241e4/satflow_workspace_mockup_1782915318944.png)

*(The mockup image is saved in your root directory as [satflow_workspace_mockup.png](file:///d:/ISRO%20HACKATHON/satflow_workspace_mockup.png). Copy and insert it directly into this slide!)*

Our workstation UI is designed around **5 primary interaction nodes** to maximize analyst productivity:

1.  **Mission Control Console (Workstation)**:
    *   **Left Column**: Control deck containing drag-and-drop slots for T0/T1 observations, frame density toggles (1, 3, 5), and engine selectors.
    *   **Right Column**: Swipe-Slider deck with pixel-level inspection zoom ($1\times$, $2\times$, $3\times$) for side-by-side cyclone core verification.
2.  **Telemetry Widget (Link monitor)**:
    *   Floating status hub in the bottom-left. Monitor active server address, active system state, hardware architecture (CUDA vs CPU), and engine selection.
3.  **Hazard Bento Grid (Landing Showcase)**:
    *   Asymmetrical card structure detailing target ISRO use-cases: Cyclone trajectories, flood propagation, thunderstorm fronts, convective cloud vectors, and active wildfires.
4.  **Flowchart Architecture view**:
    *   Interactive pipeline visualization mapping frontend operations directly to underlying mathematical routing modules.
5.  **Interactive Timeline Controller**:
    *   Playback deck with Play, Pause, Step-Forward, Step-Backward, and speed loop controls to simulate fluid cyclone movements.

---

## 🔗 Slide Placement Strategy for Live Demo Link


### 2. 🛝 Slide 5: Mock Screens & Wireframes Slide (Central Callout)
*   **Purpose**: Serves as the trigger visual during your transition from slides to the live screen-share walkthrough.
*   **Copy-Paste Template**:
    *   🚀 **Launch Live Prototype** ➔ https://satflowai.vercel.app

### 3. 🛝 Slide 6: Thank You / Q&A Slide (Center Screen)
*   **Purpose**: Remains visible on the screen during the entire 5-10 minute Q&A panel so judges can note the URL.
*   **Copy-Paste Template**:
    *   **Thank You!**
    *   *ByteBots Team*
    *   🌐 **Workstation URL**: https://satflowai.vercel.app
    *   📂 **Source Code**: https://github.com/harshshirke66/SATFLOW-AI

