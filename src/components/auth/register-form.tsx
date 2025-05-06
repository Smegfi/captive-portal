"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect } from "next/navigation"

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  return (
    <>
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Registrace</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Zadejte prosím svůj email a heslo
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Heslo</Label>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="button" className="w-full">
            Registrovat se
          </Button>
        </div>
      </form>
      <div className="flex flex-col gap-4 mt-4">
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Máte jit účet?
          </span>
        </div>
        <Button variant="outline" className="w-full" onClick={() => redirect("/login")}>
          Přihlásit se
        </Button>
        
      </div>
    </>
  )
}
