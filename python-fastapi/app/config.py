from pathlib import Path
import os

# Python 推理服务端口；网页经 Nest 转发到这里
HOST = os.getenv("YOLO_HOST", "127.0.0.1")
PORT = int(os.getenv("YOLO_PORT", "8000"))

_ROOT = Path(__file__).resolve().parent.parent

# 默认使用本目录下的 best.pt（D:\web\python-fastapi\best.pt）
_DEFAULT_MODEL = _ROOT / "best.pt"
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", str(_DEFAULT_MODEL))

CONF_THRESHOLD = float(os.getenv("YOLO_CONF", "0.25"))

_DEFAULT_YUNET = _ROOT / "models" / "face_detection_yunet_2023mar.onnx"
_DEFAULT_SFACE = _ROOT / "models" / "face_recognition_sface_2021dec.onnx"
YUNET_PATH = os.getenv("YUNET_MODEL_PATH", str(_DEFAULT_YUNET))
SFACE_PATH = os.getenv("SFACE_MODEL_PATH", str(_DEFAULT_SFACE))
FACE_SCORE_THRESHOLD = float(os.getenv("FACE_SCORE_THRESHOLD", "0.7"))
FACE_SIM_THRESHOLD = float(os.getenv("FACE_SIM_THRESHOLD", "0.5"))
