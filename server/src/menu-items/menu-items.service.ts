import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { MenuItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { handlePrismaError } from '../common/utils/prisma-error.util';

const CATEGORY_SELECT = { category: { select: { id: true, name: true } } } as const;

type MenuItemWithCategory = MenuItem & {
  category: { id: string; name: string };
};

export interface MenuItemFilters {
  search?: string;
  category?: string;
  available?: string;
}

@Injectable()
export class MenuItemsService {
  private readonly logger = new Logger(MenuItemsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: MenuItemFilters): Promise<MenuItemWithCategory[]> {
    const where: Prisma.MenuItemWhereInput = {};

    if (filters.search?.trim()) {
      where.name = { contains: filters.search.trim(), mode: 'insensitive' };
    }
    if (filters.category) {
      where.categoryId = filters.category;
    }
    if (filters.available !== undefined && filters.available !== '') {
      where.availability = filters.available === 'true';
    }

    return this.prisma.menuItem.findMany({
      where,
      include: CATEGORY_SELECT,
      orderBy: { name: 'asc' },
    }) as Promise<MenuItemWithCategory[]>;
  }

  async findOne(id: string): Promise<MenuItemWithCategory> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: CATEGORY_SELECT,
    });
    if (!item) {
      throw new NotFoundException(`Menu item with id "${id}" not found`);
    }
    return item as MenuItemWithCategory;
  }

  async create(dto: CreateMenuItemDto): Promise<MenuItemWithCategory> {
    try {
      const item = await this.prisma.menuItem.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          imageUrl: dto.imageUrl,
          availability: dto.availability ?? true,
          categoryId: dto.categoryId,
        },
        include: CATEGORY_SELECT,
      });
      this.logger.log(`Menu item created: ${item.name}`);
      return item as MenuItemWithCategory;
    } catch (error) {
      handlePrismaError(error, { entityName: 'MenuItem' });
    }
  }

  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItemWithCategory> {
    try {
      return (await this.prisma.menuItem.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.price !== undefined && { price: dto.price }),
          ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
          ...(dto.availability !== undefined && { availability: dto.availability }),
          ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        },
        include: CATEGORY_SELECT,
      })) as MenuItemWithCategory;
    } catch (error) {
      handlePrismaError(error, { entityName: 'MenuItem', identifier: id });
    }
  }

  async delete(id: string): Promise<MenuItem> {
    try {
      const item = await this.prisma.menuItem.delete({ where: { id } });
      this.logger.log(`Menu item deleted: ${item.name}`);
      return item;
    } catch (error) {
      handlePrismaError(error, { entityName: 'MenuItem', identifier: id });
    }
  }
}
