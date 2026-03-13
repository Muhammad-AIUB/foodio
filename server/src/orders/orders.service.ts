import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { OrderStatus, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SAFE_USER_SELECT } from '../users/users.service';

const ORDER_ITEM_SELECT = {
  id: true,
  menuItemId: true,
  quantity: true,
  priceSnapshot: true,
  menuItem: {
    select: { id: true, name: true, imageUrl: true, price: true },
  },
} as const;

const ORDER_SELECT = {
  id: true,
  userId: true,
  totalPrice: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  orderItems: { select: ORDER_ITEM_SELECT },
} as const;

const ADMIN_ORDER_SELECT = {
  ...ORDER_SELECT,
  user: { select: SAFE_USER_SELECT },
} as const;

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create an order inside a single transaction.
   *
   * Complexity: O(n) where n = number of distinct items.
   *  - One bulk query to fetch all menu items.
   *  - One Map for O(1) lookups per item.
   *  - One pass to build order items and compute total.
   */
  async create(userId: string, dto: CreateOrderDto) {
    const menuItemIds = [...new Set(dto.items.map((i) => i.menuItemId))];

    return this.prisma.$transaction(async (tx) => {
      const menuItems = await tx.menuItem.findMany({
        where: { id: { in: menuItemIds } },
        select: { id: true, price: true, availability: true, name: true },
      });

      if (menuItems.length !== menuItemIds.length) {
        const foundIds = new Set(menuItems.map((m) => m.id));
        const missing = menuItemIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(
          `Menu item(s) not found: ${missing.join(', ')}`,
        );
      }

      const unavailable = menuItems.filter((m) => !m.availability);
      if (unavailable.length > 0) {
        throw new BadRequestException(
          `Unavailable item(s): ${unavailable.map((m) => m.name).join(', ')}`,
        );
      }

      const priceMap = new Map(
        menuItems.map((m) => [m.id, Number(m.price)]),
      );

      let totalPrice = 0;
      const orderItemsData: {
        menuItemId: string;
        quantity: number;
        priceSnapshot: number;
      }[] = [];

      for (const item of dto.items) {
        const price = priceMap.get(item.menuItemId)!;
        totalPrice += price * item.quantity;
        orderItemsData.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceSnapshot: price,
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: OrderStatus.Pending,
          orderItems: { create: orderItemsData },
        },
        select: ORDER_SELECT,
      });

      this.logger.log(
        `Order ${order.id} placed by user ${userId} — total: ${totalPrice.toString()}`,
      );

      return order;
    });
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      select: ORDER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: ORDER_SELECT,
    });

    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('You are not allowed to view this order');
    }

    return order;
  }

  async findAll(userId: string, userRole: UserRole) {
    const where = userRole === UserRole.ADMIN ? {} : { userId };
    return this.prisma.order.findMany({
      where,
      select: ORDER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForAdmin() {
    return this.prisma.order.findMany({
      select: ADMIN_ORDER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    try {
      const order = await this.prisma.order.update({
        where: { id },
        data: { status },
        select: ORDER_SELECT,
      });

      this.logger.log(`Order ${id} status → ${status}`);
      return order;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Order with id "${id}" not found`);
      }
      throw error;
    }
  }
}
