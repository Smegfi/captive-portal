import { startGuestUserCleanupRunner } from "@/server/services/guest-user-cleanup-runner";

export async function register() {
   if (process.env.NEXT_RUNTIME === "nodejs") {
      startGuestUserCleanupRunner();
   }
}
