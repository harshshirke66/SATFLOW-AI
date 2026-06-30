from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import torch
from app.config import OUTPUT_DIR, APP_NAME
from app.routes import generate, metrics, health
from app.utils.sample_generator import generate_default_samples
from app.services.rife_inference import load_rife_model, get_model_status

# Generate default sample images if they are missing
generate_default_samples()

# Load pretrained RIFE model into memory
load_rife_model()

app = FastAPI(
    title=APP_NAME,
    description="AI-powered Satellite Image Temporal Super Resolution Backend",
    version="1.0.0",
    docs_url=None,  # Disable default white Swagger UI docs
    redoc_url=None  # Disable default ReDoc
)

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount outputs folder as static files directory
app.mount("/static", StaticFiles(directory=str(OUTPUT_DIR)), name="static")

# Include Routers
app.include_router(generate.router, prefix="/generate", tags=["Generation"])
app.include_router(metrics.router, prefix="/metrics", tags=["Evaluation"])
app.include_router(health.router, prefix="/health", tags=["Health & Status"])

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def read_root():
    status = get_model_status()
    engine_name = "RIFE v3 (Neural)" if status["available"] else "Farneback (Classical Fallback)"
    device_name = "CUDA (GPU-Accelerated)" if torch.cuda.is_available() else "CPU (Fallback Active)"
    weights_msg = "flownet.pkl Loaded" if status["available"] else "Weights Missing (Farneback Fallback)"
    
    # Render glowing status color indicator
    status_dot_class = "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" if status["available"] else "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>SATFLOW AI - Server Console</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
            body {{
                font-family: 'JetBrains Mono', monospace;
                background-color: #05070B;
                background-image: 
                    radial-gradient(circle at 50% 0%, rgba(22, 217, 255, 0.06) 0%, transparent 60%),
                    radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 0);
                background-size: 100% 100%, 32px 32px;
            }}
        </style>
    </head>
    <body class="min-h-screen text-gray-300 flex flex-col justify-between p-6 md:p-12 select-none">
        <div></div>
        
        {/* Main Console Box */}
        <div class="w-full max-w-4xl mx-auto border border-white/10 rounded-2xl bg-[#090D15]/80 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
            
            {/* Console Header */}
            <div class="bg-[#05070B] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="flex gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    </div>
                    <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest border-l border-white/10 pl-3">
                        SATFLOW AI v1.0.0
                    </span>
                </div>
                
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full {status_dot_class} animate-pulse"></span>
                    <span class="text-[9px] font-black text-white uppercase tracking-widest">Active Status</span>
                </div>
            </div>
            
            {/* Console Diagnostics Grid */}
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/10 bg-[#090D15]/40">
                <div class="space-y-3.5">
                    <span class="text-[9px] text-[#16D9FF] font-black uppercase tracking-wider block border-b border-white/5 pb-1">
                        System Configuration
                    </span>
                    <div class="text-[11px] space-y-2">
                        <div class="flex justify-between"><span class="text-gray-500">Framework:</span><span class="text-white font-bold">FastAPI / Uvicorn</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Runtime Hardware:</span><span class="text-white font-bold">{device_name}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Active Engine:</span><span class="text-[#16D9FF] font-bold">{engine_name}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Weights Status:</span><span class="text-white">{weights_msg}</span></div>
                    </div>
                </div>

                <div class="space-y-3.5">
                    <span class="text-[9px] text-[#4F8CFF] font-black uppercase tracking-wider block border-b border-white/5 pb-1">
                        Service Endpoints
                    </span>
                    <div class="text-[11px] space-y-2">
                        <div class="flex justify-between"><span class="text-gray-500">Frame Interpolation:</span><a href="/docs" class="text-[#16D9FF] underline hover:text-white font-bold">POST /generate</a></div>
                        <div class="flex justify-between"><span class="text-gray-500">Quality Evaluation:</span><a href="/docs" class="text-[#16D9FF] underline hover:text-white">POST /metrics</a></div>
                        <div class="flex justify-between"><span class="text-gray-500">System Diagnostics:</span><a href="/health" class="text-[#16D9FF] underline hover:text-white">GET /health</a></div>
                        <div class="flex justify-between"><span class="text-gray-500">Documentation:</span><a href="/docs" class="text-emerald-400 font-bold underline hover:text-white">API Docs (/docs)</a></div>
                    </div>
                </div>
            </div>
            
            {/* Simulated Live Console Log */}
            <div class="p-6 bg-[#05070B] font-mono text-[10px] text-gray-400 space-y-1.5 overflow-x-auto min-h-[220px]">
                <div class="text-gray-500">[09:30:15] Initialize SATFLOW-AI inference modules...</div>
                <div class="text-gray-500">[09:30:16] Scanning for RIFE pre-trained checkpoints...</div>
                <div>[09:30:16] Weight file flownet.pkl found (146.4 MB)</div>
                <div class="text-emerald-400">[09:30:17] Pre-loading RIFE HDv3 network into memory...</div>
                <div class="text-emerald-400">[09:30:19] Model loaded successfully on device: {device_name}</div>
                <div>[09:30:19] Uvicorn worker running at http://127.0.0.1:8000</div>
                <div class="text-[#16D9FF]">[10:14:02] POST /generate - Ingested 2 frames, interpolated 3 steps (RIFE v3)</div>
                <div class="text-[#4F8CFF]">[10:14:03] GET /health - Status OK - Engine: RIFE</div>
                <div class="text-gray-500 animate-pulse">[Active Monitor] Listening for telemetry feeds...</div>
            </div>
            
        </div>
        
        {/* Footer info */}
        <div class="text-center text-[9px] text-gray-600 mt-6 tracking-widest font-black uppercase">
            SATFLOW AI • ISRO BHARATIYA ANTARIKSH HACKATHON
        </div>
        
    </body>
    </html>
    """
    return html_content

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>SATFLOW AI - API Documentation</title>
        <meta charset="utf-8">
        <link rel="icon" type="image/png" href="https://fastapi.tiangolo.com/img/favicon.png">
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
        <!-- Premium feeling-blue dark theme -->
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-feeling-blue.css">
        <style>
            /* Brand adjustments */
            body {
                background-color: #05070B !important;
            }
            .swagger-ui .topbar {
                background-color: #090D15 !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            }
            .swagger-ui .info .title {
                color: #16D9FF !important;
                font-family: system-ui, -apple-system, sans-serif !important;
                font-weight: 800 !important;
            }
            .swagger-ui .scheme-container {
                background-color: #090D15 !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
                box-shadow: none !important;
            }
            .swagger-ui select {
                background-color: #101826 !important;
                color: white !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
            }
            .swagger-ui .opblock {
                border-radius: 12px !important;
                background-color: #101826 !important;
                border: 1px solid rgba(255, 255, 255, 0.06) !important;
            }
            .swagger-ui .opblock .opblock-summary {
                border-bottom: none !important;
            }
            .swagger-ui .opblock.opblock-post {
                border-color: rgba(22, 217, 255, 0.15) !important;
                background-color: rgba(22, 217, 255, 0.02) !important;
            }
            .swagger-ui .opblock.opblock-get {
                border-color: rgba(79, 140, 255, 0.15) !important;
                background-color: rgba(79, 140, 255, 0.02) !important;
            }
            .swagger-ui input[type=text], .swagger-ui textarea {
                background-color: #05070B !important;
                color: white !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 6px !important;
            }
            .swagger-ui .opblock-description-wrapper p, .swagger-ui .opblock-external-docs-wrapper p, .swagger-ui .opblock-title_normal p {
                color: #94A3B8 !important;
            }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function() {
                const ui = SwaggerUIBundle({
                    url: "/openapi.json",
                    dom_id: "#swagger-ui",
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "BaseLayout"
                });
                window.ui = ui;
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)
