import { z } from "zod";

export const guestUserSortColumns = ["id", "email", "marketing", "createdAt", "updatedAt"] as const;
export const sortOrders = ["asc", "desc"] as const;

export type GuestUserSortColumn = (typeof guestUserSortColumns)[number];
export type SortOrder = (typeof sortOrders)[number];

export const listGuestSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
   email: z.string(),
   marketing: z.string().optional(),
   createdFrom: z.date().optional(),
   createdTo: z.date().optional(),
   sortBy: z.enum(guestUserSortColumns).optional(),
   sortOrder: z.enum(sortOrders).optional(),
});

export const removeGuestUserSchema = z.object({
   id: z.number().int().positive(),
});

export const updateGuestUserCleanupConfigSchema = z.object({
   retentionMonths: z.number().int().min(1, "Minimální hodnota je 1 měsíc").max(60, "Maximální hodnota je 60 měsíců"),
});

export type UpdateGuestUserCleanupConfigSchemaType = z.infer<typeof updateGuestUserCleanupConfigSchema>;
