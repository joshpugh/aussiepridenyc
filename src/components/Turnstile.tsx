"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; theme?: "light" | "dark" | "auto"; appearance?: "always" | "execute" | "interaction-only" },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

export function Turnstile({ sitekey }: { sitekey: string | undefined }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sitekey) return;
    const interval = setInterval(() => {
      if (!ref.current || widgetIdRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(ref.current, {
        sitekey,
        appearance: "interaction-only",
        theme: "light",
      });
      clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [sitekey]);

  if (!sitekey) {
    return (
      <input type="hidden" name="cf-turnstile-response" value="dev-bypass" />
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={ref} className="cf-turnstile" />
    </>
  );
}
