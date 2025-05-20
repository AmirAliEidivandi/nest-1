import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'nest1-client',
  //       brokers: [
  //         `${configService.get('KAFKA_HOST')}:${configService.get('KAFKA_PORT')}`,
  //       ],
  //     },
  //     consumer: {
  //       groupId: 'nest1-consumer',
  //     },
  //   },
  // });
  // await app.startAllMicroservices();
  await app.listen(configService.get('PORT') ?? 3100);
}
bootstrap();
