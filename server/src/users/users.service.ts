import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserInput): Promise<User> {
    if (!data.email?.trim()) throw new BadRequestException('Email is required');
    const exists = await this.findByEmail(data.email);
    if (exists) throw new ConflictException('Email already registered');
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }
}
