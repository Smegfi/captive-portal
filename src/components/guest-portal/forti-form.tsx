import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { guestPortalSchema } from "@/server/actions-scheme/guest-user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch } from "react-hook-form";
import { Input } from "../ui/input";

export function FortiForm() {
   const postUrl = useWatch({ name: "connection.post" });

   const form = useForm<z.infer<typeof guestPortalSchema>>({
      resolver: zodResolver(guestPortalSchema),
      defaultValues: {
         magic: "",
         username: "",
         password: "",
      },
   });

   return (
      <Form {...form}>
         <form action={postUrl} method="post" id="guest-form" className="space-y-6">
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input type="email" placeholder="email@example.com" className="w-full" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </form>
      </Form>
   );
}
