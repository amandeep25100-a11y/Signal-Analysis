from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analysis

# Initialize FastAPI app
app = FastAPI(
    title="Audio Signal Analyzer Pro",
    description="Advanced audio signal processing and classification API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend on localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(analysis.router)

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Audio Signal Analyzer Pro API", "version": "1.0.0"}
