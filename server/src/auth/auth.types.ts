import { User } from '../users/entities/user.entity';

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
}
