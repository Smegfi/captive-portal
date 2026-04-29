import { z } from "zod";

export const listTosSchema = z.object({
   itemsPerPage: z.number().int().positive().default(10),
   page: z.number().int().positive().default(1),
   search: z.string().optional(),
});

export const uploadTosSchema = z.object({
   name: z.string().nonempty("Název dokumentu je povinný"),
   fileName: z
      .string()
      .nonempty("Název souboru je povinný")
      .refine((value) => value.toLowerCase().endsWith(".docx"), "Soubor musí mít rozšíření .docx"),
   fileSize: z.number().int().positive(),
   file: z.instanceof(File),
   uploadedAt: z.date(),
   isActive: z.boolean().default(true),
   htmlContent: z.string().optional(),
});

export const setActiveTosSchema = z.object({
   id: z.number().int().positive(),
});

export type uploadTosSchemaType = z.infer<typeof uploadTosSchema>;
