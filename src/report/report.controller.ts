import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { userInfo } from 'os';
import { SocialAuthGuard } from 'src/auth/social-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ReportDto } from 'src/dto/report.dto';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(SocialAuthGuard)
  @Post()
  @ApiOperation({
    summary: '신고 저장',
  })
  @ApiBody({ type: ReportDto })
  async createReport(
    @User() user,
    @Body() reportDto: ReportDto,
  ): Promise<void> {
    await this.reportService.createReport(user.sub, reportDto);
  }
}
