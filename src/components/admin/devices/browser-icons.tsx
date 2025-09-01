import { SiFirefox, SiGooglechrome, SiSafari } from "@icons-pack/react-simple-icons";
import { ShieldQuestion } from "lucide-react";

export function BrowserIcons({ browser }: { browser: string }) {
   if (browser.toLowerCase() === "chrome" || browser.toLowerCase() === "mobile chrome") {
      return <SiGooglechrome />;
   }
   if (browser.toLowerCase() === "safari" || browser.toLowerCase() === "mobile safari") {
      return <SiSafari />;
   }
   if (browser.toLowerCase() === "firefox" || browser.toLowerCase() === "mobile firefox") {
      return <SiFirefox />;
   }
   return <ShieldQuestion />;
}
