"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAppUserSchema, CreateAppUserSchemaType } from "@/server/actions-scheme/app-user/schema";
import { createAppUserAction, updateAppUserRoleAction } from "@/server/actions/app-user-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, UserPlus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface AppUser {
   id: string;
   name: string;
   email: string;
   role?: string | null;
}

interface AccountManagementProps {
   users: AppUser[];
}

const roleLabel: Record<"admin" | "reviewer", string> = {
   admin: "Admin",
   reviewer: "Reviewer",
};

function normalizeRole(role: string | null | undefined): "admin" | "reviewer" {
   if (role === "admin") {
      return "admin";
   }

   return "reviewer";
}

export default function AccountManagement({ users }: AccountManagementProps) {
   const router = useRouter();
   const [roles, setRoles] = useState<Record<string, "admin" | "reviewer">>(Object.fromEntries(users.map((user) => [user.id, normalizeRole(user.role)])));
   const [savingRoleUserId, setSavingRoleUserId] = useState<string | null>(null);

   const form = useForm<CreateAppUserSchemaType>({
      resolver: zodResolver(createAppUserSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
         role: "reviewer",
      },
   });

   const { execute: createUser, isExecuting: isCreatingUser } = useAction(createAppUserAction, {
      onSuccess: () => {
         toast.success("Uživatel byl vytvořen.");
         form.reset({
            name: "",
            email: "",
            password: "",
            role: "reviewer",
         });
         router.refresh();
      },
      onError: (error) => {
         toast.error(error.error.serverError?.message ?? "Nepodařilo se vytvořit uživatele.");
      },
   });

   const { executeAsync: updateRole } = useAction(updateAppUserRoleAction, {
      onSuccess: () => {
         toast.success("Role byla aktualizována.");
         router.refresh();
      },
      onError: (error) => {
         toast.error(error.error.serverError?.message ?? "Nepodařilo se uložit roli.");
      },
   });

   function onCreateUser(values: CreateAppUserSchemaType) {
      createUser(values);
   }

   async function onSaveRole(userId: string) {
      setSavingRoleUserId(userId);
      await updateRole({
         userId,
         role: roles[userId] ?? "reviewer",
      });
      setSavingRoleUserId(null);
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Administrace aplikačních účtů</CardTitle>
            <CardDescription>Vytváření účtů a nastavování rolí pro přístup do aplikace.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-8">
            <form onSubmit={form.handleSubmit(onCreateUser)} className="grid grid-cols-1 md:grid-cols-4 gap-3">
               <Input placeholder="Jméno a příjmení" {...form.register("name")} />
               <Input placeholder="email@domena.cz" type="email" {...form.register("email")} />
               <Input placeholder="Heslo" type="password" {...form.register("password")} />
               <Controller
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                     <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="admin">Admin</SelectItem>
                           <SelectItem value="reviewer">Reviewer</SelectItem>
                        </SelectContent>
                     </Select>
                  )}
               />
               <div className="md:col-span-4 flex justify-end">
                  <Button type="submit" disabled={isCreatingUser}>
                     {isCreatingUser ? <Loader2 className="animate-spin" /> : <UserPlus />}
                     Vytvořit účet
                  </Button>
               </div>
            </form>

            {Object.keys(form.formState.errors).length > 0 ? (
               <div className="text-sm text-red-500">
                  {Object.values(form.formState.errors)
                     .map((error) => error?.message)
                     .filter(Boolean)
                     .join(" ")}
               </div>
            ) : null}

            <div className="space-y-3">
               {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                     <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Select
                           value={roles[user.id] ?? "reviewer"}
                           onValueChange={(value: "admin" | "reviewer") => setRoles((prev) => ({ ...prev, [user.id]: value }))}
                        >
                           <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Role" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="admin">{roleLabel.admin}</SelectItem>
                              <SelectItem value="reviewer">{roleLabel.reviewer}</SelectItem>
                           </SelectContent>
                        </Select>
                        <Button onClick={() => onSaveRole(user.id)} disabled={savingRoleUserId === user.id}>
                           {savingRoleUserId === user.id ? <Loader2 className="animate-spin" /> : <Save />}
                           Uložit
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}
