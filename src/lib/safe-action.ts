import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient().use(async ({ next }) => {
   if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 700));
   }

   return next();
});
