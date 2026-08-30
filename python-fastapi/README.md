# Python YOLO 推理服务

端口默认 **8000**。网页登录后上传图片，由 Nest（3000）带登录态转发到本服务。

## 模型

默认读取本目录下的 `best.pt`（即 `d:\web\python-fastapi\best.pt`）。

若要用别的权重，再设置环境变量 `YOLO_MODEL_PATH`。

## 运行

```powershell
cd d:\web\python-fastapi
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

健康检查：http://127.0.0.1:8000/health  
推理接口：`POST http://127.0.0.1:8000/detect`（表单字段名 `file`）
