import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

const orderInclude = {
  orderItems: {
    include: { menuItem: true },
  },
};

const adminOrderInclude = {
  user: { select: { id: true, name: true, email: true } },
  orderItems: {
    include: { menuItem: true },
  },
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const menuItemIds = [...new Set(dto.items.map((i) => i.menuItemId))];

    return this.prisma.$transaction(async (tx) => {
      const menuItems = await tx.menuItem.findMany({
        where: { id: { in: menuItemIds } },
      });

      const foundIds = new Set(menuItems.map((m) => m.id));
      const missingIds = menuItemIds.filter((id) => !foundIds.has(id));
      if (menuItems.length !== menuItemIds.length) {
        throw new NotFoundException('One or more menu items do not exist');
      }

      const unavailable = menuItems.filter((m) => !m.availability);
      if (unavailable.length) {
        throw new BadRequestException(
          'One or more items are currently unavailable',
        );
      }

      const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));
      let totalPrice = 0;
      const orderItemsData: {
        menuItemId: string;
        quantity: number;
        priceSnapshot: number;
      }[] = [];

      for (const item of dto.items) {
        const menuItem = menuItemMap.get(item.menuItemId)!;
        const price = Number(menuItem.price);
        totalPrice += price * item.quantity;
        orderItemsData.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceSnapshot: price,
        });
      }

      return tx.order.create({
        data: {
          userId,
          totalPrice,
          status: OrderStatus.Pending,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: orderInclude,
      });
    });
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('You are not allowed to view this order');
    }
    return order;
  }

  async findAll(userId: string, userRole: string) {
    const where =
      userRole === 'ADMIN' ? {} : { userId };

    return this.prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForAdmin() {
    return this.prisma.order.findMany({
      include: adminOrderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { status },
        include: orderInclude,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Order with id "${id}" not found`);
      }
      throw e;
    }
  }
}
