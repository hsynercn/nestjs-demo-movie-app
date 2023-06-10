import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './shared/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @Public()
  getHello(): string {
    return this.appService.pong();
  }
}
