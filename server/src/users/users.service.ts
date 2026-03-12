import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(data: CreateUserInput): Promise<User> {
    if (!data.email?.trim()) throw new BadRequestException('Email is required');
    const exists = await this.findByEmail(data.email);
    if (exists) throw new ConflictException('Email already registered');
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
