import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef } from "react";

const fortiLoginSchema = z.object({
   username: z.string().nonempty(),
   password: z.string().nonempty(),
   magic: z.string().nonempty(),
});

interface FortiFormProps {
   postUrl: string;
   username: string;
   password: string;
   magic: string;
}

export default function FortiForm({ postUrl, username, password, magic }: FortiFormProps) {
   const button = useRef<HTMLButtonElement>(null);

   const { register, setValue } = useForm<z.infer<typeof fortiLoginSchema>>({
      resolver: zodResolver(fortiLoginSchema),
      defaultValues: {
         username,
         password,
         magic,
      },
   });

   useEffect(() => {
      setValue("username", username);
      setValue("password", password);
      setValue("magic", magic);

      if (fortiLoginSchema.safeParse({ username, password, magic }).success) {
         if (button.current) {
            button.current.click();
         }
      }
   }, [postUrl, username, password, magic, setValue]);

   return (
      <form action={postUrl} method="POST">
         <input type="hidden" {...register("username")} />
         <input type="hidden" {...register("password")} />
         <input type="hidden" {...register("magic")} />
         <button ref={button} type="submit" id="forti-login-button" className="hidden"></button>
      </form>
   );
}
