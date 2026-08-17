"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { guestUser, network } from "@/server/db/schema";
import { count, eq, gte, sql } from "drizzle-orm";

type DailyTrendPoint = {
   date: string;
   registeredGuests: number;
};

function getUtcStartOfDay(date: Date): Date {
   return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Dashboard statistics for admin overview.
 */
export const getDashboardStats = authActionClient.action(async () => {
   const todayStartUtc = getUtcStartOfDay(new Date());
   const trendStartUtc = new Date(todayStartUtc);
   trendStartUtc.setUTCDate(trendStartUtc.getUTCDate() - 29);

   const [dailyRegisteredGuestsResult, totalGuestUsersResult, totalActiveNetworksResult, trendRows] = await Promise.all([
      db.select({ value: count() }).from(guestUser).where(gte(guestUser.createdAt, todayStartUtc)),
      db.select({ value: count() }).from(guestUser),
      db.select({ value: count() }).from(network).where(eq(network.isActive, true)),
      db
         .select({
            day: sql<string>`DATE(${guestUser.createdAt})`.as("day"),
            value: count(),
         })
         .from(guestUser)
         .where(gte(guestUser.createdAt, trendStartUtc))
         .groupBy(sql`DATE(${guestUser.createdAt})`)
         .orderBy(sql`DATE(${guestUser.createdAt})`),
   ]);

   const trendMap = new Map<string, number>();
   for (const row of trendRows) {
      trendMap.set(row.day, row.value);
   }

   const dailyTrend: DailyTrendPoint[] = [];
   for (let index = 0; index < 30; index++) {
      const currentDate = new Date(trendStartUtc);
      currentDate.setUTCDate(trendStartUtc.getUTCDate() + index);
      const dateKey = currentDate.toISOString().slice(0, 10);

      dailyTrend.push({
         date: dateKey,
         registeredGuests: trendMap.get(dateKey) ?? 0,
      });
   }

   return {
      dailyRegisteredGuests: dailyRegisteredGuestsResult[0]?.value ?? 0,
      totalGuestUsers: totalGuestUsersResult[0]?.value ?? 0,
      totalActiveNetworks: totalActiveNetworksResult[0]?.value ?? 0,
      dailyTrend,
   };
});
