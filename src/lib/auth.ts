import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    secret: process.env.BETTER_AUTH_SECRET,

    url: process.env.BETTER_AUTH_URL,

    emailAndPassword: {  
        enabled: true,
        autoVerifyEmail: true,
        verifyEmail: {
            enabled: false,
        },
    },
    
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                default: "user"
            },            
        },
    },
});