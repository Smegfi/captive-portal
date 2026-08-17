import { getGuestUserCleanupRetentionMonths } from "@/server/repositories/guest-user/cleanup-config";
import { runGuestUserCleanup } from "@/server/repositories/guest-user/cleanup";

const RUN_INTERVAL_MS = 1000 * 60 * 60 * 24;
const GLOBAL_RUNNER_KEY = "__guestUserCleanupRunnerStarted__";

type GlobalWithCleanupRunner = typeof globalThis & {
   [GLOBAL_RUNNER_KEY]?: boolean;
};

async function executeCleanupCycle() {
   try {
      const retentionMonths = await getGuestUserCleanupRetentionMonths();
      const result = await runGuestUserCleanup(retentionMonths);

      console.info(
         `[guest-user-cleanup] retentionMonths=${retentionMonths}, threshold=${result.thresholdDate.toISOString()}, deletedCount=${result.deletedCount}`
      );
   } catch (error) {
      console.error("[guest-user-cleanup] cleanup cycle failed", error);
   }
}

export function startGuestUserCleanupRunner() {
   const globalRef = globalThis as GlobalWithCleanupRunner;
   if (globalRef[GLOBAL_RUNNER_KEY]) {
      return;
   }

   globalRef[GLOBAL_RUNNER_KEY] = true;

   void executeCleanupCycle();
   setInterval(() => {
      void executeCleanupCycle();
   }, RUN_INTERVAL_MS);
}
