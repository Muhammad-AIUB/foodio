import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

export async function hashPassword(
  password: string,
  rounds: number,
): Promise<string> {
  return bcryptHash(password, rounds) as Promise<string>;
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcryptCompare(password, hash) as Promise<boolean>;
}
