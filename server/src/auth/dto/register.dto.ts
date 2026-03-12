import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeEmail } from '../../common/dto/transformers';

export class RegisterDto {
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @Transform(normalizeEmail)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;
}
