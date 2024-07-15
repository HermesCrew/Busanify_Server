import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @Get('healthcheck')
  @ApiExcludeEndpoint()
  healthcheck(): string {
    return 'OK';
  }
}
