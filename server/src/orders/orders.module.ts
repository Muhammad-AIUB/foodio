import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersListener } from './orders.listener';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersListener],
  exports: [OrdersService],
})
export class OrdersModule {}
