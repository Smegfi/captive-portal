import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatToMegabytes(bytes: number) {
   return (bytes / 1024 / 1024).toFixed(2);
}

/**
 * Sestaví popisek verze TOS ve tvaru `d/m/yyyy-N` (datum aktivace + globální číslo verze).
 * Vrátí `null`, pokud dokument nebyl nikdy aktivován.
 */
export function formatTosVersion(activeFrom: Date | null | undefined, versionNumber: number | null | undefined): string | null {
   if (!activeFrom || versionNumber == null) {
      return null;
   }

   const date = new Date(activeFrom);
   return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}-${versionNumber}`;
}

/**
 * Dokument je neměnný (nelze přejmenovat ani smazat), jakmile byl jednou aktivován.
 */
export function isTosImmutable(tos: { activeFrom: Date | null | undefined }): boolean {
   return tos.activeFrom != null;
}
