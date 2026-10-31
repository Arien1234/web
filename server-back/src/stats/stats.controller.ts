import { Controller, Get, Post } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('visits')
  async read() {
    const visits = await this.statsService.getHomeVisits();
    return { code: 0, data: { visits } };
  }

  /** 首页打开时记一次访客（公开） */
  @Post('visits')
  async bump() {
    const visits = await this.statsService.bumpHomeVisits();
    return { code: 0, data: { visits } };
  }
}
