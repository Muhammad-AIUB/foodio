import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface PrismaErrorContext {
  entityName: string;
  identifier?: string;
}

/**
 * Maps Prisma-specific error codes to meaningful NestJS HTTP exceptions.
 * Call this in a catch block to avoid repeating the same switch/if chains
 * across every service method.
 */
export function handlePrismaError(
  error: unknown,
  ctx: PrismaErrorContext,
): never {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw error;
  }

  const id = ctx.identifier ?? 'unknown';

  switch (error.code) {
    case 'P2002': {
      const fields = (error.meta?.target as string[])?.join(', ') ?? 'field';
      throw new ConflictException(
        `${ctx.entityName} with that ${fields} already exists`,
      );
    }
    case 'P2003':
      throw new BadRequestException(
        `Related entity for ${ctx.entityName} not found`,
      );
    case 'P2025':
      throw new NotFoundException(
        `${ctx.entityName} with id "${id}" not found`,
      );
    default:
      throw error;
  }
}
