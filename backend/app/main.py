from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import OUTPUT_DIR, APP_NAME
from app.routes import generate, metrics, health
from app.utils.sample_generator import generate_default_samples
from app.services.rife_inference import load_rife_model

# Generate default sample images if they are missing
generate_default_samples()

# Load pretrained RIFE model into memory
load_rife_model()

app = FastAPI(
    title=APP_NAME,
    description="AI-powered Satellite Image Temporal Super Resolution Backend",
    version="1.0.0"
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
# Files saved in OUTPUT_DIR will be accessible at http://localhost:8000/static/{filename}
app.mount("/static", StaticFiles(directory=str(OUTPUT_DIR)), name="static")

# Include Routers
app.include_router(generate.router, prefix="/generate", tags=["Generation"])
app.include_router(metrics.router, prefix="/metrics", tags=["Evaluation"])
app.include_router(health.router, prefix="/health", tags=["Health & Status"])

@app.get("/")
def read_root():
    return {"message": f"Welcome to {APP_NAME} API. Access docs at /docs"}
