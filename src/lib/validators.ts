import { z } from 'zod'

export const screeningRecordSchema = z.object({
  componentId: z.string(),
  timestamp: z.string().datetime(),
  temperature: z.number().optional(),
  voltage: z.number().optional(),
  current: z.number().optional(),
  resistance: z.number().optional(),
  leakageCurrent: z.number().optional(),
  stressDuration: z.number().optional(),
}).catchall(z.unknown())

export const datasetUploadSchema = z.object({
  file: z.any()
    .refine((file) => file?.size <= 50 * 1024 * 1024, 'Max file size is 50MB')
    .refine(
      (file) => ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file?.type),
      'Only .csv, .json, and .xlsx formats are supported.'
    )
})

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  timestamp: z.string().datetime(),
  references: z.array(z.string()).optional()
})
