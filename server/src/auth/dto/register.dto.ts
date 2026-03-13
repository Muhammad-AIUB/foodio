import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeEmail } from '../../common/dto/transformers';

export class RegisterDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @Transform(normalizeEmail)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
