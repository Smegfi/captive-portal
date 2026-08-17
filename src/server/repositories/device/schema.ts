import { z } from "zod";

export const deviceSortColumns = ["id", "mac", "user", "firstSeenAt"] as const;
export const sortOrders = ["asc", "desc"] as const;

export type DeviceSortColumn = (typeof deviceSortColumns)[number];
export type SortOrder = (typeof sortOrders)[number];

export const listDeviceSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
   mac: z.string(),
   user: z.string(),
   device: z.string().optional(),
   connectedFrom: z.date().optional(),
   connectedTo: z.date().optional(),
   sortBy: z.enum(deviceSortColumns).optional(),
   sortOrder: z.enum(sortOrders).optional(),
});
