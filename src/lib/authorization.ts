import { auth, Session } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const LOGIN_PATH = "/login";

async function getRequestPath(): Promise<string | null> {
   const headersList = await headers();
   return headersList.get("x-pathname");
}

export function redirectToLogin(path?: string | null): never {
   if (path && path !== LOGIN_PATH && !path.startsWith(`${LOGIN_PATH}?`)) {
      redirect(`${LOGIN_PATH}?redirectTo=${encodeURIComponent(path)}`);
   }

   redirect(LOGIN_PATH);
}

export const ROLE_ADMIN = "admin";
export const ROLE_REVIEWER = "reviewer";

export type AppRole = typeof ROLE_ADMIN | typeof ROLE_REVIEWER;

const reviewerAliases = new Set<string>([ROLE_REVIEWER, "user"]);

export function normalizeRole(role: string | null | undefined): AppRole | null {
   if (role === ROLE_ADMIN) {
      return ROLE_ADMIN;
   }

   if (role && reviewerAliases.has(role)) {
      return ROLE_REVIEWER;
   }

   return null;
}

export function isAdminRole(role: string | null | undefined): boolean {
   return normalizeRole(role) === ROLE_ADMIN;
}

export function canAccessPortal(role: string | null | undefined): boolean {
   return normalizeRole(role) !== null;
}

export function canAccessAdminPath(role: string | null | undefined, path: string): boolean {
   const normalizedRole = normalizeRole(role);

   if (normalizedRole === ROLE_ADMIN) {
      return true;
   }

   if (normalizedRole === ROLE_REVIEWER) {
      return path === "/admin" || path.startsWith("/admin/users");
   }

   return false;
}

export async function getRequiredSession(): Promise<Session> {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (session === null) {
      redirectToLogin(await getRequestPath());
   }

   return session;
}

export async function requirePortalRole(): Promise<Session> {
   const session = await getRequiredSession();

   if (!canAccessPortal(session.user.role)) {
      redirectToLogin(await getRequestPath());
   }

   return session;
}

export async function requireAdminRole(): Promise<Session> {
   const session = await requirePortalRole();

   if (!isAdminRole(session.user.role)) {
      redirect("/admin");
   }

   return session;
}
