import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatToMegabytes(bytes: number) {
   return (bytes / 1024 / 1024).toFixed(2);
}
