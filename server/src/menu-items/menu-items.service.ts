import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

const categoryInclude = { category: true };

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: {
    search?: string;
    category?: string;
    available?: string;
  }) {
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
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: categoryInclude,
    });
    if (!item) {
      throw new NotFoundException(`Menu item with id "${id}" not found`);
    }
    return item;
  }

  async create(dto: CreateMenuItemDto) {
    try {
      return await this.prisma.menuItem.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          imageUrl: dto.imageUrl,
          availability: dto.availability ?? true,
          categoryId: dto.categoryId,
        },
        include: categoryInclude,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        (e.code === 'P2003' || e.code === 'P2025')
      ) {
        throw new BadRequestException('Category not found');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    try {
      return await this.prisma.menuItem.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.price !== undefined && { price: dto.price }),
          ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
          ...(dto.availability !== undefined && { availability: dto.availability }),
          ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        },
        include: categoryInclude,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Menu item with id "${id}" not found`);
      }
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        (e.code === 'P2003')
      ) {
        throw new BadRequestException('Category not found');
      }
      throw e;
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.menuItem.delete({
        where: { id },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Menu item with id "${id}" not found`);
      }
      throw e;
    }
  }
}
