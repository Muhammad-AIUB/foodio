"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AdminFoodItem } from "@/data/menuItems";
import { uploadMenuItemImage } from "@/lib/imageUpload";
import { toast } from "@/lib/toast";
import ToggleSwitch from "./ToggleSwitch";
import ImageUpload from "./ImageUpload";

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: AdminFoodItem) => Promise<void> | void;
  item: AdminFoodItem | null;
  categories: string[];
}

interface FormValues {
  name: string;
  price: string;
  category: string;
  description: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
}

export default function AddEditItemModal({
  isOpen,
  onClose,
  onSave,
  item,
  categories,
}: AddEditItemModalProps) {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [available, setAvailable] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormValues({
          name: item.name,
          price: String(item.price),
          category: item.category,
          description: item.description,
        });
        setAvailable(item.status === "available");
      } else {
        setFormValues({
          name: "",
          price: "",
          category: "",
          description: "",
        });
        setAvailable(true);
      }
      setSelectedFile(null);
      setErrors({});
      setFileError(null);
      setSubmitting(false);
    }
  }, [isOpen, item]);

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

  const updateField = (field: keyof FormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    if (field === "name" || field === "price" || field === "category") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!formValues.category.trim()) {
      nextErrors.category = categories.length
        ? "Category is required."
        : "Create a category before saving a menu item.";
    }

    const normalizedPrice = formValues.price.replace("$", "").trim();
    if (!normalizedPrice) {
      nextErrors.price = "Price is required.";
    } else {
      const priceValue = Number(normalizedPrice);
      if (Number.isNaN(priceValue) || priceValue <= 0) {
        nextErrors.price = "Enter a valid price greater than 0.";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (fileError) {
      toast.error(fileError);
      return;
    }

    try {
      setSubmitting(true);

      let imageUrl = item?.image || "/images/image1.jpeg";
      if (selectedFile) {
        imageUrl = await uploadMenuItemImage(selectedFile);
      }

      const priceNum = Number(formValues.price.replace("$", "").trim());
      await onSave({
        id: item?.id || crypto.randomUUID(),
        name: formValues.name.trim(),
        price: priceNum,
        category: formValues.category,
        description: formValues.description.trim(),
        image: imageUrl,
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

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setFileError(null);
  };

  const handleFileValidationError = (message: string) => {
    setSelectedFile(null);
    setFileError(message);
    toast.error(message);
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

            <form noValidate onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(e) => updateField("name", e.target.value)}
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
                    value={formValues.price}
                    onChange={(e) => updateField("price", e.target.value)}
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
                  value={formValues.category}
                  onChange={(e) => updateField("category", e.target.value)}
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
                  value={formValues.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Image
                </label>
                <ImageUpload
                  fileName={selectedFile?.name ?? null}
                  error={fileError ?? undefined}
                  onFileSelect={handleFileSelect}
                  onValidationError={handleFileValidationError}
                />
                {item?.image && !selectedFile && (
                  <p className="mt-1.5 text-xs text-text-muted">
                    Leave this empty to keep the current image.
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
                  disabled={submitting}
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
