"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import {
  MENU_ITEM_IMAGE_HELPER_TEXT,
  MENU_ITEM_IMAGE_MIME_TYPES,
  validateMenuItemImageFile,
} from "@/lib/validation/menuItemForm";

interface ImageUploadProps {
  fileName: string | null;
  error?: string;
  onFileSelect: (file: File | null) => void | Promise<void>;
  onValidationError?: (message: string) => void;
}

export default function ImageUpload({
  fileName,
  error,
  onFileSelect,
  onValidationError,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) {
      onFileSelect(null);
      return;
    }

    const validationError = validateMenuItemImageFile(file);
    if (validationError) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onValidationError?.(validationError);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          error
            ? "border-red-300 bg-red-50/60 hover:border-red-400"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Upload className="w-6 h-6 text-text-muted mb-2" />
        <p className="text-sm text-text-dark">
          Drag or click <span className="font-bold">here</span> to upload
        </p>
        <p className="text-xs text-text-muted mt-1">{MENU_ITEM_IMAGE_HELPER_TEXT}</p>
        <input
          ref={inputRef}
          type="file"
          accept={MENU_ITEM_IMAGE_MIME_TYPES.join(",")}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

      {fileName && (
        <div className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200">
          <span className="text-sm text-text-dark">1. {fileName}</span>
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = "";
              }
              onFileSelect(null);
            }}
            className="text-text-muted hover:text-text-dark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
