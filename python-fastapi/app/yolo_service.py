"""YOLO 推理：读图、画框、返回检测明细。"""

from __future__ import annotations

import base64
from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO

from app.config import CONF_THRESHOLD, MODEL_PATH


class YoloDetector:
    def __init__(self) -> None:
        path = Path(MODEL_PATH)
        if not path.is_file():
            raise FileNotFoundError(
                f"未找到模型文件：{path}。请把 best.pt 放到该路径，或设置环境变量 YOLO_MODEL_PATH。"
            )
        self.model = YOLO(str(path))

    def infer(self, image_bytes: bytes) -> dict:
        bgr = cv2.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
        if bgr is None:
            raise ValueError("无法解析图片，请上传 jpg / png / bmp")

        results = self.model(bgr, conf=CONF_THRESHOLD)
        res = results[0]
        plotted = res.plot()
        ok, encoded = cv2.imencode(".jpg", plotted)
        if not ok:
            raise RuntimeError("结果图编码失败")

        detections = []
        for box in res.boxes:
            cls_id = int(box.cls[0])
            xyxy = box.xyxy[0].cpu().numpy().round(1).tolist()
            detections.append(
                {
                    "className": res.names[cls_id],
                    "confidence": round(float(box.conf[0]), 3),
                    "box": xyxy,
                }
            )

        image_b64 = base64.b64encode(encoded.tobytes()).decode("ascii")
        return {
            "image": f"data:image/jpeg;base64,{image_b64}",
            "detections": detections,
            "message": "未检测到目标" if not detections else f"共检测到 {len(detections)} 个目标",
        }
