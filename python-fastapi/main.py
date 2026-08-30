from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.config import HOST, PORT
from app.yolo_service import YoloDetector

detector: YoloDetector | None = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global detector
    detector = YoloDetector()
    yield


app = FastAPI(title="澜知 YOLO 推理服务", lifespan=lifespan)
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
