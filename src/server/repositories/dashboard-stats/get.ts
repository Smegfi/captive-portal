"use server";

import { APP_TIME_ZONE } from "@/lib/date";
import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { guestUser, network } from "@/server/db/schema";
import { count, eq, sql } from "drizzle-orm";

type DailyTrendPoint = {
   date: string;
   registeredGuests: number;
};

const TREND_DAY_COUNT = 30;

function calendarDateKey(date: Date): string {
   return new Intl.DateTimeFormat("en-CA", {
      timeZone: APP_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
   }).format(date);
}

function shiftDateKey(dateKey: string, days: number): string {
   const [year, month, day] = dateKey.split("-").map(Number);
   const shifted = new Date(Date.UTC(year, month - 1, day + days));
   return shifted.toISOString().slice(0, 10);
}

function toCount(value: unknown): number {
   const parsed = typeof value === "number" ? value : Number(value);
   return Number.isFinite(parsed) ? parsed : 0;
}

function toDateKey(value: unknown): string | null {
   if (typeof value === "string") {
      const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
      return match?.[1] ?? null;
   }

   if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
   }

   return null;
}

function localDayExpression() {
   return sql`to_char(timezone(${APP_TIME_ZONE}, ${guestUser.createdAt}), 'YYYY-MM-DD')`;
}

/**
 * Dashboard statistics for admin overview.
 */
export const getDashboardStats = authActionClient.action(async () => {
   const todayKey = calendarDateKey(new Date());
   const trendStartKey = shiftDateKey(todayKey, -(TREND_DAY_COUNT - 1));

   const [dailyRegisteredGuestsResult, totalGuestUsersResult, totalActiveNetworksResult, trendRows] = await Promise.all([
      db
         .select({ value: count() })
         .from(guestUser)
         .where(sql`(timezone(${APP_TIME_ZONE}, ${guestUser.createdAt}))::date >= (timezone(${APP_TIME_ZONE}, now()))::date`),
      db.select({ value: count() }).from(guestUser),
      db.select({ value: count() }).from(network).where(eq(network.isActive, true)),
      db
         .select({
            day: localDayExpression().as("day"),
            value: count(),
         })
         .from(guestUser)
         .where(sql`(timezone(${APP_TIME_ZONE}, ${guestUser.createdAt}))::date >= ((timezone(${APP_TIME_ZONE}, now()))::date - ${TREND_DAY_COUNT - 1}::int)`)
         .groupBy(sql`1`)
         .orderBy(sql`1`),
   ]);

   const trendMap = new Map<string, number>();
   for (const row of trendRows) {
      const dateKey = toDateKey(row.day);
      if (!dateKey) {
         continue;
      }

      trendMap.set(dateKey, toCount(row.value));
   }

   const dailyTrend: DailyTrendPoint[] = [];
   for (let index = 0; index < TREND_DAY_COUNT; index++) {
      const dateKey = shiftDateKey(trendStartKey, index);

      dailyTrend.push({
         date: dateKey,
         registeredGuests: trendMap.get(dateKey) ?? 0,
      });
   }

   return {
      dailyRegisteredGuests: toCount(dailyRegisteredGuestsResult[0]?.value),
      totalGuestUsers: toCount(totalGuestUsersResult[0]?.value),
      totalActiveNetworks: toCount(totalActiveNetworksResult[0]?.value),
      dailyTrend,
   };
});
