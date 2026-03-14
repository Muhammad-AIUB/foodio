import { Injectable, Logger } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface DashboardStats {
  totalOrders: number;
  totalMenuItems: number;
  totalCategories: number;
  pendingOrders: number;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [totalOrders, totalMenuItems, totalCategories, pendingOrders] =
      await Promise.all([
        this.prisma.order.count(),
        this.prisma.menuItem.count(),
        this.prisma.category.count(),
        this.prisma.order.count({ where: { status: OrderStatus.Pending } }),
      ]);

    this.logger.log('Dashboard stats fetched');

    return { totalOrders, totalMenuItems, totalCategories, pendingOrders };
  }
}
