import { z } from "zod";

export const MENU_ITEM_IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MENU_ITEM_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;
export const MENU_ITEM_IMAGE_HELPER_TEXT =
  "Size must be maximum 5MB. Supported formats: PNG, JPEG, WEBP";

function isBrowserFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

export const menuItemImageFileSchema = z
  .custom<File | undefined>(
    (value) => value == null || isBrowserFile(value),
    "Please select a valid image file."
  )
  .refine(
    (file) =>
      !file ||
      MENU_ITEM_IMAGE_MIME_TYPES.includes(
        file.type as (typeof MENU_ITEM_IMAGE_MIME_TYPES)[number]
      ),
    "Unsupported image format. Please use PNG, JPEG, or WEBP."
  )
  .refine(
    (file) => !file || file.size <= MENU_ITEM_IMAGE_MAX_FILE_SIZE,
    "Image size must be 5MB or smaller."
  );

export const menuItemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(150, "Name must be 150 characters or fewer."),
  price: z
    .string()
    .trim()
    .min(1, "Price is required.")
    .refine((value) => {
      const parsed = Number(value.replace("$", "").trim());
      return !Number.isNaN(parsed) && parsed > 0;
    }, "Enter a valid price greater than 0."),
  category: z.string().trim().min(1, "Category is required."),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or fewer."),
  imageUrl: z.string().trim().optional(),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export function validateMenuItemImageFile(file: File) {
  const result = menuItemImageFileSchema.safeParse(file);
  if (result.success) {
    return null;
  }

  return result.error.issues[0]?.message ?? "Please select a valid image file.";
}
