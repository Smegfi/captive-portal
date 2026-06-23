export const APP_TIME_ZONE = "Europe/Prague";

const dateTimeFormatter = new Intl.DateTimeFormat("cs-CZ", {
   timeZone: APP_TIME_ZONE,
   day: "2-digit",
   month: "2-digit",
   year: "numeric",
   hour: "2-digit",
   minute: "2-digit",
});

/**
 * Formats an instant in the fixed application time zone (Europe/Prague),
 * independent of where the server or viewer is located. Output: `23.06.2026 22:05`.
 */
export function formatDateTime(date: Date | null | undefined): string {
   if (!date) return "-";
   return dateTimeFormatter.format(date).replace(", ", " ");
}
