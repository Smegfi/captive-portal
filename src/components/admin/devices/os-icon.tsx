import { SiAndroid, SiApple, SiLinux, SiMacos } from "@icons-pack/react-simple-icons";
import { ShieldQuestion } from "lucide-react";

export function OsIcon({ os }: { os: string }) {
   if (os.toLowerCase() === "linux") {
      return <SiLinux />;
   }
   if (os.toLowerCase() === "macos") {
      return <SiMacos />;
   }
   if (os.toLowerCase() === "android") {
      return <SiAndroid />;
   }
   if (os.toLowerCase() === "ios") {
      return <SiApple />;
   }
   return <ShieldQuestion />;
}
