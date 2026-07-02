import { z } from "zod";

export const listTosSchema = z.object({
   itemsPerPage: z.number().int().positive().default(10),
   page: z.number().int().positive().default(1),
   search: z.string().optional(),
});

export const uploadTosSchema = z.object({
   name: z.string().trim().nonempty("Název dokumentu je povinný"),
   fileName: z
      .string()
      .nonempty("Název souboru je povinný")
      .refine((value) => value.toLowerCase().endsWith(".docx"), "Soubor musí mít rozšíření .docx"),
   fileSize: z.number().int().positive(),
   file: z.instanceof(File),
   uploadedAt: z.date(),
   setActive: z.boolean().default(false),
   htmlContent: z.string().optional(),
});

export const setActiveTosSchema = z.object({
   id: z.number().int().positive(),
});

export const cloneTosSchema = z.object({
   id: z.number().int().positive(),
});

export const renameTosSchema = z.object({
   id: z.number().int().positive(),
   name: z.string().nonempty("Název dokumentu je povinný"),
});

export const updateTosHtmlSchema = z.object({
   id: z.number().int().positive(),
   htmlContent: z.string(),
});

export const deleteTosSchema = z.object({
   id: z.number().int().positive(),
});

export type uploadTosSchemaType = z.infer<typeof uploadTosSchema>;
