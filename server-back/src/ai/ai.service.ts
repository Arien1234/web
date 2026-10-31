import { Injectable, BadGatewayException } from '@nestjs/common';
import { PythonClient } from './python.client';

@Injectable()
export class AiService {
  constructor(private readonly python: PythonClient) {}

  async detect(file: { buffer: Buffer; originalname: string; mimetype: string }) {
    const { blob, name } = this.python.toBlob(file);
    const form = new FormData();
    form.append('file', blob, name);
    try {
      return await this.python.postForm('/detect', form);
    } catch (err) {
      throw new BadGatewayException(err instanceof Error ? err.message : 'YOLO 推理失败');
    }
  }
}
