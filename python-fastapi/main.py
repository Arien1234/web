from contextlib import asynccontextmanager
import json

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.config import HOST, PORT
from app.face_service import FaceEngine
from app.yolo_service import YoloDetector

detector: YoloDetector | None = None
face_engine: FaceEngine | None = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global detector, face_engine
    detector = YoloDetector()
    face_engine = FaceEngine()
    yield


app = FastAPI(title="澜知 AI 推理服务", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"code": 0, "message": "ok"}


@app.post("/detect")
async def detect(file: UploadFile = File(...)) -> dict:
    if detector is None:
        raise HTTPException(status_code=503, detail="模型尚未加载完成")
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="请上传图片")
    try:
        data = detector.infer(raw)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"code": 0, "data": data}


@app.post("/face/embed")
async def face_embed(file: UploadFile = File(...)) -> dict:
    if face_engine is None:
        raise HTTPException(status_code=503, detail="人脸模型尚未加载完成")
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="请上传图片")
    try:
        data = face_engine.embed(raw)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"code": 0, "data": data}


@app.post("/face/match")
async def face_match(file: UploadFile = File(...), gallery: str = Form("[]")) -> dict:
    if face_engine is None:
        raise HTTPException(status_code=503, detail="人脸模型尚未加载完成")
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="请上传图片")
    try:
        items = json.loads(gallery)
        if not isinstance(items, list):
            raise ValueError("人脸库格式无效")
        data = face_engine.match(raw, items)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="人脸库格式无效") from exc
    return {"code": 0, "data": data}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
