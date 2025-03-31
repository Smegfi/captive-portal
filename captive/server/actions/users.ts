"use server";

import { signIn } from "@/lib/auth";
import { db } from "@/server/db/sqlite/database";
import { usersTable } from "@/server/db/sqlite/schema";

export async function getUsers() {
   const users = await db.query.usersTable.findMany();
   return users;
}
