# Python 推理服务

端口默认 **8000**。网页登录后上传图片，由 Nest（3000）带登录态转发到本服务。

## 模型

| 文件 | 用途 |
|------|------|
| `best.pt` | 视觉检测 |
| `models/face_detection_yunet_2023mar.onnx` | 人脸检测 |
| `models/face_recognition_sface_2021dec.onnx` | 人脸特征 |

可用环境变量 `YOLO_MODEL_PATH`、`YUNET_MODEL_PATH`、`SFACE_MODEL_PATH` 覆盖路径。

## 运行

会自动使用本目录的 `.venv`（没有则创建并安装依赖）：

```powershell
cd d:\web\python-fastapi
.\start.ps1
```

健康检查：http://127.0.0.1:8000/health  
视觉检测：`POST /detect`  
人脸特征：`POST /face/embed`  
人脸比对：`POST /face/match`
