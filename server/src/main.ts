import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- cookie-parser is a CJS middleware
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: config.get<string>('CLIENT_URL') ?? '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');

  const port = config.get<number>('PORT') ?? 5000;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}/api/v1`);
}

void bootstrap();
