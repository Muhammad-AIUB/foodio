import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const allowedOrigins = Array.from(
    new Set(
      [
        'https://foodio-one-ochre.vercel.app',
        config.get<string>('FRONTEND_URL')?.replace(/\/+$/, ''),
        'http://localhost:3000',
      ].filter((origin): origin is string => Boolean(origin)),
    ),
  );

  logger.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['set-cookie'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  const port = config.get<number>('PORT') || 5000;
  await app.listen(port, '0.0.0.0'); // Important for Render
  logger.log(`Server running on port ${port}`);
}

void bootstrap();
