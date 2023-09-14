"use client";

import "@uploadthing/react/styles.css";
import { OurFileRouter } from "app/api/uploadthing/core";
import { UploadDropzone } from "lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

type FileUploadProps = {
  endpoint: keyof OurFileRouter;
  value: string;
  onChange: (url?: string) => void;
};

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="uploaded image" className="rounded-full" />
        <button
          onClick={() => {
            onChange("");
          }}
          className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
        >
          <X className="h-4 w-4"></X>
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error: ", error);
      }}
    />
  );
};
