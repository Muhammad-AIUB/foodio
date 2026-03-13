import { SafeUser } from '../users/users.service';

export interface AuthResponse {
  accessToken: string;
  user: SafeUser;
}
