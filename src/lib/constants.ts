export const DEFAULT_ITEMS_PER_PAGE = 25;
export const DEFAULT_PAGE = 1;

export function parsePositiveInt(value: string | undefined, fallback: number) {
   const parsed = Number.parseInt(value || "", 10);
   return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
