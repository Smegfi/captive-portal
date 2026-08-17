import { z } from "zod";

/**
 * Schéma pro vytvoření sítě
 */
export const createNetworkSchema = z.object({
   name: z.string().nonempty(),
   ssid: z.string().nonempty(),
   isActive: z.boolean().optional(),
});

/**
 * Schéma pro získání wifi sítě
 */
export const getNetworkSchema = z.object({
   id: z.number().int().positive(),
});

/**
 * Schéma pro odstranění wifi sítě
 */
export const removeNetworkSchema = z.object({
   id: z.number().int().positive(),
});

/**
 * Schéma pro aktualizaci wifi sítě
 */
export const updateNetworkSchema = z.object({
   id: z.number().int().positive(),
   name: z.string().nonempty(),
   ssid: z.string().nonempty(),
   isActive: z.boolean().optional(),
});
