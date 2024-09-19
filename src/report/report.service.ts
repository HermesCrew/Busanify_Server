import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportDto } from 'src/dto/report.dto';
import { ReportEntity } from 'src/entities/report.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
  ) {}

  async createReport(
    currentUserId: string,
    reportDto: ReportDto,
  ): Promise<void> {
    const { reportedContentId, reportedUserId, content, reportType } =
      reportDto;

    if (!currentUserId) {
      throw new BadRequestException('userId is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let report = this.reportRepository.create({
      reportedContentId,
      reportedUserId,
      currentUserId,
      content,
      reportType,
    });

    await this.reportRepository.save(report);
  }
}
