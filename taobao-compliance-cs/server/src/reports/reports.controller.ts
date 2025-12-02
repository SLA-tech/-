import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/reports')
// @UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sensitive-summary')
  async getSensitiveSummary(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return await this.reportsService.getSensitiveSummary(
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }
}


