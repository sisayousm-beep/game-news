from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import Base, engine
from .routers import ingest, read

app = FastAPI(title="LOGIA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(read.router)
app.include_router(ingest.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(engine)


@app.get("/")
def health():
    return {"service": "LOGIA API", "ok": True}
