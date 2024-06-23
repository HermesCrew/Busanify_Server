import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('healthcheck')
  healthcheck(): string {
    return 'OK';
  }
}
