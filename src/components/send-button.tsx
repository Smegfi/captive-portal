"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Loader2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MIN_LOADING_MS = 1000;
const RESULT_VISIBLE_MS = 2000;

type SendPhase = "idle" | "loading" | "success" | "error";

interface SendButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick"> {
   /** Resolves when the email was sent. Reject to show the error state. */
   onSend: () => Promise<void>;
}

function delay(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextFrame() {
   return new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
}

async function waitAtLeast(ms: number, since: number) {
   let remaining = ms - (performance.now() - since);
   while (remaining > 0) {
      await delay(remaining);
      remaining = ms - (performance.now() - since);
   }
}

export function SendButton({ onSend, className, disabled, children = "Odeslat", type = "submit", ...props }: SendButtonProps) {
   const [phase, setPhase] = useState<SendPhase>("idle");
   const phaseRef = useRef<SendPhase>("idle");
   const onSendRef = useRef(onSend);
   const aliveRef = useRef(true);
   onSendRef.current = onSend;

   useEffect(() => {
      aliveRef.current = true;
      return () => {
         aliveRef.current = false;
      };
   }, []);

   async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      if (disabled || phaseRef.current !== "idle") {
         return;
      }

      phaseRef.current = "loading";
      setPhase("loading");
      await nextFrame();
      await nextFrame();

      const visibleStart = performance.now();
      let succeeded = false;

      try {
         await onSendRef.current();
         succeeded = true;
      } catch {
         succeeded = false;
      }

      await waitAtLeast(MIN_LOADING_MS, visibleStart);

      if (!aliveRef.current) {
         return;
      }

      const nextPhase: SendPhase = succeeded ? "success" : "error";
      phaseRef.current = nextPhase;
      setPhase(nextPhase);

      await delay(RESULT_VISIBLE_MS);

      if (!aliveRef.current) {
         return;
      }

      phaseRef.current = "idle";
      setPhase("idle");
   }

   return (
      <Button
         type={type}
         disabled={disabled || phase !== "idle"}
         aria-busy={phase === "loading"}
         data-state={phase}
         onClick={handleClick}
         className={cn(
            phase !== "idle" && "disabled:opacity-100",
            phase === "success" && "bg-green-600 text-white hover:bg-green-600 focus-visible:ring-green-600/30",
            phase === "error" && "bg-red-600 text-white hover:bg-red-600 focus-visible:ring-red-600/30",
            className
         )}
         {...props}
      >
         {phase === "loading" && <Loader2 className="animate-spin" />}
         {phase === "success" && <Check />}
         {phase === "error" && <X />}
         {phase === "idle" && <Send />}
         {children}
      </Button>
   );
}
