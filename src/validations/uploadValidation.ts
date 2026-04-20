import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/gif"];
const ACCEPTED_DOCUMENT_TYPES = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
        (file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type),
        { message: "Invalid document file type" }
    );


    const fileSizeLimit = 5 * 1024 * 1024; // 5MB

// export const fileUploadSchema = z.object({
//     files: z
//         .instanceof(FileList)
//         .refine((list) => list.length > 0, "No files selected")
//         .refine((list) => list.length <= 5, "Maximum 5 files allowed")
//         .transform((list) => Array.from(list))
//         .refine(
//             (files) => {
//                 const allowedTypes: { [key: string]: boolean } = {
//                     "image/jpeg": true,
//                     "image/png": true,
//                     "application/pdf": true,
//                     "application/msword": true,
//                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
//                 };
//                 return files.every((file) => allowedTypes[file.type]);
//             },
//             { message: "Invalid file type. Allowed types: JPG, PNG, PDF, DOC, DOCX" }
//         )
//         .refine(
//             (files) => {
//                 return files.every((file) => file.size <= fileSizeLimit);
//             },
//             {
//                 message: "File size should not exceed 5MB",
//             }
//         ),
// });