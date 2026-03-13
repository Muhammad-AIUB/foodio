import { Injectable } from '@nestjs/common';
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
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [totalOrders, totalMenuItems, totalCategories, pendingOrders] =
      await Promise.all([
        this.prisma.order.count(),
        this.prisma.menuItem.count(),
        this.prisma.category.count(),
        this.prisma.order.count({ where: { status: OrderStatus.Pending } }),
      ]);

    return {
      totalOrders,
      totalMenuItems,
      totalCategories,
      pendingOrders,
    };
  }
}
