import { z } from "zod";

export const connectionSortColumns = ["id", "mac", "network", "updatedAt"] as const;
export const sortOrders = ["asc", "desc"] as const;

export type ConnectionSortColumn = (typeof connectionSortColumns)[number];
export type SortOrder = (typeof sortOrders)[number];

export const listConnectionSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
   mac: z.string(),
   network: z.string(),
   user: z.string(),
   updatedFrom: z.date().optional(),
   updatedTo: z.date().optional(),
   sortBy: z.enum(connectionSortColumns).optional(),
   sortOrder: z.enum(sortOrders).optional(),
});
