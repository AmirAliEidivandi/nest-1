import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.connect();
  }

  sendMessage() {
    return this.kafkaClient.emit('nest1-topic', {
      message: 'Hello World from Nest1',
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
