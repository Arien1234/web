"""YuNet 检测 + SFace 特征，用于人脸录入与比对。"""

from __future__ import annotations

import base64
from pathlib import Path

import cv2
import numpy as np

from app.config import (
    FACE_SCORE_THRESHOLD,
    FACE_SIM_THRESHOLD,
    SFACE_PATH,
    YUNET_PATH,
)


def _b64_jpeg(bgr: np.ndarray) -> str:
    ok, encoded = cv2.imencode(".jpg", bgr)
    if not ok:
        raise RuntimeError("结果图编码失败")
    return f"data:image/jpeg;base64,{base64.b64encode(encoded.tobytes()).decode('ascii')}"


def _decode(image_bytes: bytes) -> np.ndarray:
    bgr = cv2.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
    if bgr is None:
        raise ValueError("无法解析图片")
    return bgr


class FaceEngine:
    def __init__(self) -> None:
        yunet = Path(YUNET_PATH)
        sface = Path(SFACE_PATH)
        if not yunet.is_file() or not sface.is_file():
            raise FileNotFoundError(
                f"未找到人脸模型，请将 onnx 放到 python-fastapi/models/：{yunet} / {sface}"
            )
        self.detector = cv2.FaceDetectorYN_create(
            str(yunet),
            "",
            (320, 320),
            FACE_SCORE_THRESHOLD,
            0.3,
            5000,
        )
        self.recognizer = cv2.FaceRecognizerSF_create(str(sface), "")
        self.sim_threshold = FACE_SIM_THRESHOLD

    def _faces(self, frame: np.ndarray):
        h, w = frame.shape[:2]
        self.detector.setInputSize((w, h))
        _, faces = self.detector.detect(frame)
        return faces

    def _pick(self, faces: np.ndarray) -> np.ndarray:
        areas = faces[:, 2] * faces[:, 3]
        return faces[int(np.argmax(areas))]

    def _feature(self, frame: np.ndarray, face: np.ndarray) -> np.ndarray:
        aligned = self.recognizer.alignCrop(frame, face)
        return self.recognizer.feature(aligned)

    def _draw(self, frame: np.ndarray, faces: np.ndarray, label: str | None) -> np.ndarray:
        out = frame.copy()
        for face in faces:
            box = face[:4].astype(np.int32)
            cv2.rectangle(out, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), (0, 220, 180), 2)
            pts = face[4:14].reshape(-1, 2).astype(np.int32)
            for pt in pts:
                cv2.circle(out, tuple(pt), 2, (80, 140, 255), -1)
        if label:
            cv2.putText(out, label, (12, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 220, 180), 2)
        return out

    def embed(self, image_bytes: bytes) -> dict:
        frame = _decode(image_bytes)
        faces = self._faces(frame)
        if faces is None or len(faces) == 0:
            raise ValueError("未检测到人脸，请正对摄像头")
        face = self._pick(faces)
        feat = self._feature(frame, face)
        plotted = self._draw(frame, faces, "face ok")
        return {
            "feature": feat.flatten().astype(float).tolist(),
            "score": round(float(face[-1]), 3),
            "image": _b64_jpeg(plotted),
        }

    def match(self, image_bytes: bytes, gallery: list[dict]) -> dict:
        frame = _decode(image_bytes)
        faces = self._faces(frame)
        if faces is None or len(faces) == 0:
            raise ValueError("未检测到人脸，请正对摄像头")
        face = self._pick(faces)
        feat = self._feature(frame, face)

        best_id = None
        best_sim = 0.0
        for item in gallery:
            db_feat = np.asarray(item["feature"], dtype=np.float32).reshape(1, -1)
            sim = float(self.recognizer.match(feat, db_feat, cv2.FaceRecognizerSF_FR_COSINE))
            if sim > best_sim:
                best_sim = sim
                best_id = int(item["id"])

        matched = best_id is not None and best_sim >= self.sim_threshold
        label = f"ok {best_sim:.2f}" if matched else f"unknown {best_sim:.2f}"
        plotted = self._draw(frame, faces, label)
        return {
            "userId": best_id if matched else None,
            "similarity": round(best_sim, 4),
            "matched": matched,
            "image": _b64_jpeg(plotted),
        }
