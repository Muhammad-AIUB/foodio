"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  fileName: string | null;
  onFileSelect: (file: File | null) => void;
}

export default function ImageUpload({
  fileName,
  onFileSelect,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        <Upload className="w-6 h-6 text-text-muted mb-2" />
        <p className="text-sm text-text-dark">
          Drag or click <span className="font-bold">here</span> to upload
        </p>
        <p className="text-xs text-text-muted mt-1">
          Size must be maximum 2mb. Supported formats : PNG & JPEG
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {fileName && (
        <div className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200">
          <span className="text-sm text-text-dark">1. {fileName}</span>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="text-text-muted hover:text-text-dark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
