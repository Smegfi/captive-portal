import { z } from "zod";

export const listTosSchema = z.object({
   itemsPerPage: z.number().int().positive().default(10),
   page: z.number().int().positive().default(1),
   search: z.string().optional(),
});

export const uploadTosSchema = z.object({
   name: z.string().nonempty(),
   fileName: z.string().nonempty(),
   fileSize: z.number().int().positive(),
   uploadedAt: z.date(),
});

export type uploadTosSchemaType = z.infer<typeof uploadTosSchema>;
