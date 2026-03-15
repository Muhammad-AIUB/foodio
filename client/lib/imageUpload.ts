import { validateMenuItemImageFile } from "@/lib/validation/menuItemForm";

export async function uploadMenuItemImage(file: File) {
  const validationError = validateMenuItemImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (imgbbApiKey) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed. Please try again.");
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: { display_url?: string; url?: string };
    };
    const imageUrl = payload.data?.display_url ?? payload.data?.url;

    if (!payload.success || !imageUrl) {
      throw new Error("Image upload failed. Please try again.");
    }

    return imageUrl;
  }

  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (cloudinaryCloudName && cloudinaryUploadPreset) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryUploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed. Please try again.");
    }

    const payload = (await response.json()) as { secure_url?: string; url?: string };
    const imageUrl = payload.secure_url ?? payload.url;

    if (!imageUrl) {
      throw new Error("Image upload failed. Please try again.");
    }

    return imageUrl;
  }

  throw new Error(
    "Image upload is not configured. Set NEXT_PUBLIC_IMGBB_API_KEY or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME with NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
  );
}
