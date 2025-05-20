import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('nest2-topic')
  getMessage(@Payload() message: any) {
    console.log('Received message from Nest2: ', message);
  }

  @Get('send')
  sendMessage() {
    return this.appService.sendMessage();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
