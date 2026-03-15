"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import type { AdminFoodItem } from "@/data/menuItems";
import { toast } from "@/lib/toast";
import {
  type MenuItemFormValues,
  menuItemFormSchema,
} from "@/lib/validation/menuItemForm";
import ToggleSwitch from "./ToggleSwitch";
import ImageUpload from "./ImageUpload";

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: AdminFoodItem) => Promise<void> | void;
  item: AdminFoodItem | null;
  categories: string[];
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
  const [convertingImage, setConvertingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    register,
    reset,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      description: "",
      imageUrl: undefined,
    },
  });
  const imageUrl = watch("imageUrl");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: item?.name ?? "",
        price: item ? String(item.price) : "",
        category: item?.category ?? "",
        description: item?.description ?? "",
        imageUrl: item?.image ?? undefined,
      });
      setAvailable(item?.status === "available" || !item);
      setFileName(null);
      clearErrors("imageUrl");
      setConvertingImage(false);
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

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("Failed to convert image to Base64."));
      };

      reader.onerror = () => reject(new Error("Failed to convert image to Base64."));
      reader.readAsDataURL(file);
    });

  const handleFileSelect = async (file: File | null) => {
    if (!file) {
      setFileName(null);
      setValue("imageUrl", item?.image ?? undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("imageUrl");
      return;
    }

    try {
      setConvertingImage(true);
      const base64Image = await readFileAsDataUrl(file);
      setFileName(file.name);
      setValue("imageUrl", base64Image, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("imageUrl");
    } catch (error) {
      setFileName(null);
      setValue("imageUrl", undefined, {
        shouldDirty: true,
        shouldValidate: false,
      });
      setError("imageUrl", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Failed to convert image to Base64.",
      });
      toast.error("Failed to convert image to Base64.");
    } finally {
      setConvertingImage(false);
    }
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
      const priceNum = Number(values.price.replace("$", "").trim());
      await onSave({
        id: item?.id || crypto.randomUUID(),
        name: values.name.trim(),
        price: priceNum,
        category: values.category,
        description: values.description.trim(),
        image: values.imageUrl || item?.image || "/images/image1.jpeg",
        status: available ? "available" : "unavailable",
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
                  {...register("category")}
                  aria-invalid={Boolean(errors.category)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none ${
                    errors.category ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>
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
                {item?.image && !fileName && !imageUrl?.startsWith("data:image") && (
                  <p className="mt-1.5 text-xs text-text-muted">
                    Leave this empty to keep the current image.
                  </p>
                )}
                {convertingImage && (
                  <p className="mt-1.5 text-xs text-text-muted">
                    Converting image to Base64...
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
                  disabled={submitting || convertingImage}
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
