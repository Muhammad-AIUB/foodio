import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

interface RequestWithUser {
  user: User;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User =>
    ctx.switchToHttp().getRequest<RequestWithUser>().user,
);
