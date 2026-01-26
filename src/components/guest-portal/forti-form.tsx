import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const fortiLoginSchema = z.object({
   username: z.string().nonempty(),
   password: z.string().nonempty(),
   magic: z.string().nonempty(),
});

interface FortiFormProps {
   username: string;
   password: string;
   magic: string;
}

export default function FortiForm({ username, password, magic }: FortiFormProps) {
   const button = useRef<HTMLButtonElement>(null);
   const params = useSearchParams();
   const post = params.get("post");

   console.log("post", post);

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
      console.log("Values changed:", { username, password, magic, post });
   }, [post, username, password, magic, setValue]);

   return (
      <form action={post ?? ""} method="POST">
         <input type="hidden" {...register("username")} />
         <input type="hidden" {...register("password")} />
         <input type="hidden" {...register("magic")} />
         <button ref={button} type="submit" id="forti-login-button" className="hidden"></button>
      </form>
   );
}
