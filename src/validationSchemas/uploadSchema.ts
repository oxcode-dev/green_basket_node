import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/gif",];

export const imageSchema = z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg and .png formats are supported."
    );

// Document Schema
export const documentSchema = z
    .instanceof(File)
    .refine(
        (file) =>
        [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
        { message: "Invalid document file type" }
    );

// Image Schema
export const IMAGE_SCHEMA = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
        "image/gif",
      ].includes(file.type),
    { message: "Invalid image file type" }
  );