from pathlib import Path
import os

# Python 推理服务端口；网页经 Nest 转发到这里
HOST = os.getenv("YOLO_HOST", "127.0.0.1")
PORT = int(os.getenv("YOLO_PORT", "8000"))

# 默认使用本目录下的 best.pt（D:\web\python-fastapi\best.pt）
_DEFAULT_MODEL = Path(__file__).resolve().parent.parent / "best.pt"
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", str(_DEFAULT_MODEL))

CONF_THRESHOLD = float(os.getenv("YOLO_CONF", "0.25"))
