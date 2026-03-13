import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: dto.name,
          description: dto.description,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          `Category with name "${dto.name}" already exists`,
        );
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: dto,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Category with id "${id}" not found`);
      }
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          `Category with name "${dto.name}" already exists`,
        );
      }
      throw e;
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Category with id "${id}" not found`);
      }
      throw e;
    }
  }
}
