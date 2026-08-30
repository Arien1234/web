import { Injectable, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(private readonly config: ConfigService) {}

  /** 把登录用户上传的图片转发到 Python YOLO 服务 */
  async detect(file: { buffer: Buffer; originalname: string; mimetype: string }) {
    const base =
      this.config.get<string>('YOLO_SERVICE_URL') || 'http://127.0.0.1:8000';
    const form = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype || 'application/octet-stream',
    });
    form.append('file', blob, file.originalname || 'image.jpg');

    let response: Response;
    try {
      response = await fetch(`${base}/detect`, { method: 'POST', body: form });
    } catch {
      throw new BadGatewayException('无法连接 YOLO 服务，请确认 Python 已在 8000 端口运行');
    }

    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
      message?: string;
      code?: number;
      data?: unknown;
    } | null;

    if (!response.ok) {
      const detail = payload?.detail || payload?.message || 'YOLO 推理失败';
      throw new BadGatewayException(detail);
    }
    return payload;
  }
}
