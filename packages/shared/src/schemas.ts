import { z } from 'zod';

export const uploadRequestSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  byteSize: z.number().positive().max(200 * 1024 * 1024), // 200MB max
});

export const uploadCommitSchema = z.object({
  key: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  byteSize: z.number(),
  sha256Hex: z.string().length(64),
});

export const deleteDuplicatesSchema = z.object({
  deleteAssetIds: z.array(z.string()),
});

export const emailSchema = z.object({
  email: z.string().email(),
});

export const presignRequestSchema = z.object({
  filename: z.string(),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
});

export type UploadRequest = z.infer<typeof uploadRequestSchema>;
export type UploadCommit = z.infer<typeof uploadCommitSchema>;
export type DeleteDuplicates = z.infer<typeof deleteDuplicatesSchema>;
export type EmailRequest = z.infer<typeof emailSchema>;
export type PresignRequest = z.infer<typeof presignRequestSchema>;
