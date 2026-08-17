"use client";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAppUser } from "@/server/repositories/app-user/create";
import { removeAppUser } from "@/server/repositories/app-user/remove";
import { resetAppUserPassword } from "@/server/repositories/app-user/reset-password";
import {
   createAppUserSchema,
   CreateAppUserSchemaType,
   resetAppUserPasswordSchema,
   ResetAppUserPasswordSchemaType,
   updateAppUserSchema,
   UpdateAppUserSchemaType,
} from "@/server/repositories/app-user/schema";
import { updateAppUser } from "@/server/repositories/app-user/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Pencil, Save, Trash2, UserPlus } from "lucide-react";
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
   currentUserId: string;
}

function normalizeRole(role: string | null | undefined): "admin" | "reviewer" {
   if (role === "admin") {
      return "admin";
   }

   return "reviewer";
}

function FormErrors({ messages }: { messages: (string | undefined)[] }) {
   const filtered = messages.filter(Boolean);

   if (filtered.length === 0) {
      return null;
   }

   return <div className="text-sm text-red-500">{filtered.join(" ")}</div>;
}

function DeleteUserDialog({ user }: { user: AppUser }) {
   const router = useRouter();
   const [open, setOpen] = useState(false);

   const { execute: deleteUser, isExecuting: isDeletingUser } = useAction(removeAppUser, {
      onSuccess: () => {
         toast.success("Uživatel byl smazán.");
         router.refresh();
         setOpen(false);
      },
      onError: (error) => {
         toast.error(error.error.serverError?.message ?? "Nepodařilo se smazat uživatele.");
      },
   });

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button variant="destructive">
               <Trash2 />
               Smazat
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Opravdu smazat účet?</AlertDialogTitle>
               <AlertDialogDescription>
                  Účet {user.name} ({user.email}) bude trvale smazán včetně přihlášení. Tuto akci nelze vrátit zpět.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel disabled={isDeletingUser}>Zrušit</AlertDialogCancel>
               <AlertDialogAction
                  variant="destructive"
                  disabled={isDeletingUser}
                  onClick={(event) => {
                     event.preventDefault();
                     deleteUser({ userId: user.id });
                  }}
               >
                  {isDeletingUser ? <Loader2 className="animate-spin" /> : <Trash2 />}
                  Smazat
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}

function EditUserDialog({ user, isSelf }: { user: AppUser; isSelf: boolean }) {
   const router = useRouter();
   const [open, setOpen] = useState(false);

   const detailsForm = useForm<UpdateAppUserSchemaType>({
      resolver: zodResolver(updateAppUserSchema),
      defaultValues: {
         userId: user.id,
         name: user.name,
         email: user.email,
         role: normalizeRole(user.role),
      },
   });

   const passwordForm = useForm<ResetAppUserPasswordSchemaType>({
      resolver: zodResolver(resetAppUserPasswordSchema),
      defaultValues: {
         userId: user.id,
         password: "",
      },
   });

   const { execute: saveUser, isExecuting: isSavingUser } = useAction(updateAppUser, {
      onSuccess: () => {
         toast.success("Uživatel byl uložen.");
         router.refresh();
         setOpen(false);
      },
      onError: (error) => {
         toast.error(error.error.serverError?.message ?? "Nepodařilo se uložit uživatele.");
      },
   });

   const { execute: resetPassword, isExecuting: isResettingPassword } = useAction(resetAppUserPassword, {
      onSuccess: () => {
         toast.success("Heslo bylo změněno.");
         passwordForm.reset({ userId: user.id, password: "" });
      },
      onError: (error) => {
         toast.error(error.error.serverError?.message ?? "Nepodařilo se změnit heslo.");
      },
   });

   function onOpenChange(next: boolean) {
      setOpen(next);

      if (!next) {
         detailsForm.reset({
            userId: user.id,
            name: user.name,
            email: user.email,
            role: normalizeRole(user.role),
         });
         passwordForm.reset({ userId: user.id, password: "" });
      }
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogTrigger asChild>
            <Button variant="outline">
               <Pencil />
               Upravit
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Úprava účtu</DialogTitle>
               <DialogDescription>Úprava údajů a hesla aplikačního účtu.</DialogDescription>
            </DialogHeader>

            <form onSubmit={detailsForm.handleSubmit((values) => saveUser(values))} className="space-y-3">
               <div className="space-y-1.5">
                  <Label htmlFor={`name-${user.id}`}>Jméno a příjmení</Label>
                  <Input id={`name-${user.id}`} {...detailsForm.register("name")} />
               </div>
               <div className="space-y-1.5">
                  <Label htmlFor={`email-${user.id}`}>Email</Label>
                  <Input id={`email-${user.id}`} type="email" {...detailsForm.register("email")} />
               </div>
               <div className="space-y-1.5">
                  <Label htmlFor={`role-${user.id}`}>Role</Label>
                  <Controller
                     control={detailsForm.control}
                     name="role"
                     render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={isSelf}>
                           <SelectTrigger id={`role-${user.id}`} className="w-full">
                              <SelectValue placeholder="Role" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="reviewer">Reviewer</SelectItem>
                           </SelectContent>
                        </Select>
                     )}
                  />
                  {isSelf ? <p className="text-xs text-muted-foreground">Vlastní roli nelze změnit.</p> : null}
               </div>
               <FormErrors
                  messages={[
                     detailsForm.formState.errors.name?.message,
                     detailsForm.formState.errors.email?.message,
                     detailsForm.formState.errors.role?.message,
                  ]}
               />
               <div className="flex justify-end">
                  <Button type="submit" disabled={isSavingUser}>
                     {isSavingUser ? <Loader2 className="animate-spin" /> : <Save />}
                     Uložit
                  </Button>
               </div>
            </form>

            <div className="border-t pt-4">
               <form onSubmit={passwordForm.handleSubmit((values) => resetPassword(values))} className="space-y-3">
                  <div className="space-y-1.5">
                     <Label htmlFor={`password-${user.id}`}>Reset hesla</Label>
                     <Input id={`password-${user.id}`} type="password" placeholder="Nové heslo" {...passwordForm.register("password")} />
                  </div>
                  <FormErrors messages={[passwordForm.formState.errors.password?.message]} />
                  <div className="flex justify-end">
                     <Button type="submit" variant="secondary" disabled={isResettingPassword}>
                        {isResettingPassword ? <Loader2 className="animate-spin" /> : <KeyRound />}
                        Změnit heslo
                     </Button>
                  </div>
               </form>
            </div>
         </DialogContent>
      </Dialog>
   );
}

export default function AccountManagement({ users, currentUserId }: AccountManagementProps) {
   const router = useRouter();

   const form = useForm<CreateAppUserSchemaType>({
      resolver: zodResolver(createAppUserSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
         role: "reviewer",
      },
   });

   const { execute: createUser, isExecuting: isCreatingUser } = useAction(createAppUser, {
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

   function onCreateUser(values: CreateAppUserSchemaType) {
      createUser(values);
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

            <FormErrors messages={Object.values(form.formState.errors).map((error) => error?.message)} />

            <div className="space-y-3">
               {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                     <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                     </div>
                     <div className="flex items-center gap-2">
                        <EditUserDialog user={user} isSelf={user.id === currentUserId} />
                        {user.id === currentUserId ? null : <DeleteUserDialog user={user} />}
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}
