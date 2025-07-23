import { checkUserRole } from "@/lib/auth";
import { HttpStatus } from "@/lib/status-codes";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export class ActionError extends Error {}
export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
export class BadRequestError extends Error {}

export const actionClient = createSafeActionClient({
   defineMetadataSchema() {
      return z.object({
         role: z.string().optional(),
      });
   },
   handleServerError(e) {
      if (e instanceof UnauthorizedError) {
         return {
            status: HttpStatus.Unauthorized,
            message: e.message,
         };
      }

      if (e instanceof ForbiddenError) {
         return {
            status: HttpStatus.Forbidden,
            message: e.message,
         };
      }
   },
}).use(async ({ next }) => {
   if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 700));
   }

   return next();
});

export const authActionClient = actionClient.use(async ({ next, metadata }) => {
   if (metadata.role !== undefined) {
      await checkUserRole(metadata.role);
   }

   return next();
});
