import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import type { StorageEngine } from 'multer';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const MENU_ITEM_IMAGE_MAX_FILE_SIZE = 20 * 1024 * 1024;
export const MENU_ITEM_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

// multer types are loosely resolved; assert to satisfy type-checked lint
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const memoryStorageEngine = memoryStorage() as StorageEngine;

export const menuItemImageMulterOptions: MulterOptions = {
  // memoryStorageEngine is typed as StorageEngine via assertion above
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  storage: memoryStorageEngine,
  limits: {
    fileSize: MENU_ITEM_IMAGE_MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, callback) => {
    if (MENU_ITEM_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(
      new BadRequestException(
        'Unsupported image format. Please upload PNG, JPEG, or WEBP.',
      ),
      false,
    );
  },
};
