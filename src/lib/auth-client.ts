import type { auth } from "@/lib/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";

export const authClient = createAuthClient({
   baseURL: process.env.BETTER_AUTH_URL,
   plugins: [inferAdditionalFields<typeof auth>()],
});

interface UseAuthProps {
   redirectTo?: string;
}

export function useAuth({ redirectTo }: UseAuthProps) {
   const { data: session } = authClient.useSession();

   if (session === null) {
      if (redirectTo) {
         redirect(`/login?redirectTo=${redirectTo}`);
      } else {
         redirect("/login");
      }
   }

   return session;
}
