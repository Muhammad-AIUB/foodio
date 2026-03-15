import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MenuItem, UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StrictParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { menuItemImageMulterOptions } from './menu-item-upload.config';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('available') available?: string,
  ) {
    return this.menuItemsService.findAll({ search, category, available });
  }

  @Get(':id')
  findOne(@Param('id', StrictParseUUIDPipe) id: string) {
    return this.menuItemsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuItemsService.create(dto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', menuItemImageMulterOptions))
  uploadImage(
    @UploadedFile()
    file?: { originalname: string; mimetype: string; size: number },
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    return {
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', StrictParseUUIDPipe) id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  delete(@Param('id', StrictParseUUIDPipe) id: string): Promise<MenuItem> {
    return this.menuItemsService.delete(id);
  }
}
