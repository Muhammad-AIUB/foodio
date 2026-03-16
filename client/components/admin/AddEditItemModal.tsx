"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import type { AdminFoodItem } from "@/data/menuItems";
import { toast } from "@/lib/toast";
import { uploadToImgBB } from "@/lib/imgbb";
import {
  type MenuItemFormValues,
  menuItemFormSchema,
} from "@/lib/validation/menuItemForm";
import ToggleSwitch from "./ToggleSwitch";
import ImageUpload from "./ImageUpload";

interface CategoryOption {
  id: string;
  name: string;
}

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: AdminFoodItem & { newImageUrl?: string }) => Promise<void> | void;
  item: AdminFoodItem | null;
  categories: CategoryOption[];
}

export default function AddEditItemModal({
  isOpen,
  onClose,
  onSave,
  item,
  categories,
}: AddEditItemModalProps) {
  const [available, setAvailable] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    register,
    reset,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      price: "",
      categoryId: "",
      description: "",
      imageUrl: undefined,
    },
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: item?.name ?? "",
        price: item ? String(item.price) : "",
        categoryId: item?.categoryId ?? "",
        description: item?.description ?? "",
        imageUrl: item?.image ?? undefined,
      });
      setAvailable(item?.status === "available" || !item);
      setFileName(null);
      setPendingFile(null);
      clearErrors("imageUrl");
      setUploadingImage(false);
      setSubmitting(false);
    }
  }, [isOpen, item, reset, clearErrors]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setFileName(null);
      setPendingFile(null);
      setValue("imageUrl", item?.image ?? undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("imageUrl");
      return;
    }

    setPendingFile(file);
    setFileName(file.name);
    const previewUrl = URL.createObjectURL(file);
    setValue("imageUrl", previewUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors("imageUrl");
  };

  const handleFileValidationError = (message: string) => {
    setFileName(null);
    setValue("imageUrl", undefined, { shouldDirty: true, shouldValidate: false });
    setError("imageUrl", { type: "manual", message });
    toast.error(message);
  };

  const onSubmit = async (values: MenuItemFormValues) => {
    try {
      setSubmitting(true);

      let imageValue = values.imageUrl || item?.image || "/images/image1.jpeg";

      if (pendingFile) {
        try {
          setUploadingImage(true);
          imageValue = await uploadToImgBB(pendingFile);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to upload image."
          );
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const priceNum = Number(values.price.replace("$", "").trim());
      const categoryName = categories.find((c) => c.id === values.categoryId)?.name ?? "";
      await onSave({
        id: item?.id || crypto.randomUUID(),
        name: values.name.trim(),
        price: priceNum,
        category: categoryName,
        categoryId: values.categoryId,
        description: values.description.trim(),
        image: imageValue,
        status: available ? "available" : "unavailable",
        newImageUrl: pendingFile ? imageValue : undefined,
      });

      toast.success(item ? "Menu item updated." : "Menu item created.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save the menu item."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onError = () => {
    toast.error("Please fix the validation errors before saving.");
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-cream rounded-3xl p-8 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-primary italic">
                {item ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-text-muted hover:text-text-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    aria-invalid={Boolean(errors.name)}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">
                    Price
                  </label>
                  <input
                    type="text"
                    {...register("price")}
                    aria-invalid={Boolean(errors.price)}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.price ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {errors.price && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Category
                </label>
                <select
                  {...register("categoryId")}
                  aria-invalid={Boolean(errors.categoryId)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none ${
                    errors.categoryId ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Image
                </label>
                <ImageUpload
                  fileName={fileName}
                  error={errors.imageUrl?.message}
                  onFileSelect={handleFileSelect}
                  onValidationError={handleFileValidationError}
                />
                {item?.image && !fileName && (
                  <p className="mt-1.5 text-xs text-text-muted">
                    Leave this empty to keep the current image.
                  </p>
                )}
                {uploadingImage && (
                  <p className="mt-1.5 text-xs text-text-muted">
                    Uploading image...
                  </p>
                )}
              </div>

              <ToggleSwitch
                checked={available}
                onChange={setAvailable}
                label="Available for Order"
              />

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
