import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PythonClient {
  constructor(private readonly config: ConfigService) {}

  url() {
    return this.config.get<string>('YOLO_SERVICE_URL') || 'http://127.0.0.1:8000';
  }

  async postForm(path: string, form: FormData) {
    let response: Response;
    try {
      response = await fetch(`${this.url()}${path}`, { method: 'POST', body: form });
    } catch {
      throw new Error('无法连接推理服务，请确认 Python 已在 8000 端口运行');
    }
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
      message?: string;
      code?: number;
      data?: unknown;
    } | null;
    if (!response.ok) {
      const error = new Error(payload?.detail || payload?.message || '推理失败') as Error & {
        status: number;
      };
      error.status = response.status;
      throw error;
    }
    if (!payload) {
      throw new Error('推理响应无效');
    }
    return payload;
  }

  toBlob(file: { buffer: Buffer; originalname: string; mimetype: string }) {
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype || 'application/octet-stream',
    });
    return { blob, name: file.originalname || 'image.jpg' };
  }
}
