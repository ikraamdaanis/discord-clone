import { generateComponents } from "@uploadthing/react";
import { FileRouter } from "uploadthing/next";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<FileRouter>();
