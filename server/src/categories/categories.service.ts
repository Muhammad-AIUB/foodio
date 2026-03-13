import { Injectable, Logger } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { handlePrismaError } from '../common/utils/prisma-error.util';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      const category = await this.prisma.category.create({
        data: { name: dto.name, description: dto.description },
      });
      this.logger.log(`Category created: ${category.name}`);
      return category;
    } catch (error) {
      handlePrismaError(error, { entityName: 'Category' });
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error, { entityName: 'Category', identifier: id });
    }
  }

  async delete(id: string): Promise<Category> {
    try {
      const category = await this.prisma.category.delete({ where: { id } });
      this.logger.log(`Category deleted: ${category.name}`);
      return category;
    } catch (error) {
      handlePrismaError(error, { entityName: 'Category', identifier: id });
    }
  }
}
