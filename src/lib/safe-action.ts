import { auth } from "@/lib/auth";
import { isAdminRole, normalizeRole, redirectToLogin } from "@/lib/authorization";
import { HttpStatus } from "@/lib/status-codes";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

export class ActionError extends Error {}
export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
export class BadRequestError extends Error {}

export const actionClient = createSafeActionClient({
   handleServerError(e) {
      if (e instanceof UnauthorizedError) {
         return {
            status: HttpStatus.Unauthorized,
            message: e.message,
            error: e,
         };
      }

      if (e instanceof ForbiddenError) {
         return {
            status: HttpStatus.Forbidden,
            message: e.message,
            error: e,
         };
      }
   },
}).use(async ({ next }) => {
   if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 700));
   }

   return next();
});

export const authenticatedActionClient = actionClient.use(async ({ next }) => {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (session === null) {
      redirectToLogin((await headers()).get("x-pathname"));
   }

   return next();
});

export const adminActionClient = authenticatedActionClient.use(async ({ next }) => {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (session === null) {
      redirectToLogin((await headers()).get("x-pathname"));
   }

   if (!isAdminRole(session.user.role)) {
      throw new ForbiddenError("Nemáte oprávnění k tomuto obsahu");
   }

   return next();
});

export const reviewerActionClient = authenticatedActionClient.use(async ({ next }) => {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (session === null) {
      redirectToLogin((await headers()).get("x-pathname"));
   }

   if (normalizeRole(session.user.role) === null) {
      throw new ForbiddenError("Nemáte oprávnění k tomuto obsahu");
   }

   return next();
});

export const authActionClient = adminActionClient;
