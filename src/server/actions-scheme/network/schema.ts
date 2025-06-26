import { z } from "zod";

export const newNetworkSchema = z.object({
   name: z.string().nonempty(),
   ssid: z.string().nonempty(),
   isActive: z.boolean().optional(),
});

export const updateNetworkSchema = z.object({
   id: z.number().int().positive(),
   name: z.string().nonempty(),
   ssid: z.string().nonempty(),
   isActive: z.boolean().optional(),
});

export const removeNetworkSchema = z.object({
   id: z.number().int().positive(),
});

export const getNetworkSchema = z.object({
   id: z.number().int().positive(),
});

export const listNetworkSchema = z.object({
   itemsPerPage: z.number().int().positive().default(10),
   page: z.number().int().positive().default(1),
   search: z.string().optional(),
});
