import { ApiProperty } from '@nestjs/swagger';

export class ReportDto {
  reportedContentId: number;
  reportedUserId: string;
  content: string;
  reportType: number;
}
