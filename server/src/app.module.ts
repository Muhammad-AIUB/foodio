import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    UsersModule,
    AdminModule,
    CategoriesModule,
    MenuItemsModule,
    OrdersModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
