import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

interface OrderProcessEvent {
  userId: string;
  payload: CreateOrderDto;
}

@Injectable()
export class OrdersListener {
  private readonly logger = new Logger(OrdersListener.name);

  constructor(private readonly ordersService: OrdersService) {}

  @OnEvent('order.process')
  async handleOrderProcess(event: OrderProcessEvent) {
    this.logger.log(
      `Processing order for user ${event.userId} in background...`,
    );

    try {
      const order = await this.ordersService.processOrder(
        event.userId,
        event.payload,
      );

      if (order) {
        this.logger.log(
          `Order ${order.id} processed successfully for user ${event.userId}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to process order for user ${event.userId}: ${error.message}`,
        error.stack,
      );
    }
  }
}
