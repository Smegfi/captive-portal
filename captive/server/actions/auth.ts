"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginUser({username, password}: {username: string, password: string}) {
   try {
      await signIn("credentials", {
         username,
         password
      });
   } catch(error) {
      if (error instanceof AuthError) {
         console.log(error.message);
      }
      if (error instanceof Error) {
         console.log(error.message);
      }
   }
}  