from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.prediction_routes import router as prediction_router
from app.routes.user_routes import router as user_router

app = FastAPI()

# ===== CORS (frontend <-> backend) =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Routes =====
app.include_router(prediction_router)
app.include_router(user_router)


@app.get("/")
def root():
    return {"status": "Backend is running"}


