import { SafeUser } from '../users/users.service';

export interface AuthResponse {
  accessToken: string;
  user: SafeUser;
}

export interface RegisterResponse {
  success: true;
  message: string;
}
