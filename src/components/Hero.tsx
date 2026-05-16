import { IconBackdrop } from "./IconBackdrop";
import { EVENT } from "@/config/event";

export function Hero({ marchCount, marchCap }: { marchCount: number; marchCap: number }) {
  const remaining = Math.max(marchCap - marchCount, 0);
  return (
    <section className="relative bg-aussie-gradient grain overflow-hidden">
      <IconBackdrop />
      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-28 sm:pt-28 sm:pb-36 text-center">
        <p
          className="hero-rise text-sm sm:text-base uppercase tracking-[0.3em] font-semibold text-white/90 mb-6 drop-shadow"
          style={{ animationDelay: "0.05s" }}
        >
          {EVENT.date}
        </p>
        <h1
          className="hero-rise font-display text-6xl sm:text-8xl text-white mb-6 drop-shadow-lg"
          style={{ animationDelay: "0.15s" }}
        >
          March with us
          <br />
          at NYC Pride.
        </h1>
        <p
          className="hero-rise text-lg sm:text-xl text-white/95 max-w-xl mx-auto mb-8 drop-shadow"
          style={{ animationDelay: "0.4s" }}
        >
          Join the Aussie contingent at the biggest Pride parade in the world.
          Free t-shirt, free dance classes, all the cheer of a sun-drenched
          Sydney summer.
        </p>
        <div
          className="hero-rise flex flex-col sm:flex-row gap-3 justify-center items-center"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#register"
            className="pulse-glow text-base uppercase tracking-wider font-semibold bg-white text-pink-dark py-4 px-8 rounded-full hover:bg-aussie-gold hover:text-foreground hover:scale-105 active:scale-100 transition-all duration-200"
          >
            Register now
          </a>
          <a
            href="#about"
            className="text-white/90 underline-offset-4 hover:underline text-sm"
          >
            Tell me more →
          </a>
        </div>
        {remaining < marchCap && remaining > 0 && (
          <p className="mt-8 text-white/90 text-sm">
            {remaining} of {marchCap} spots left
          </p>
        )}
      </div>
    </section>
  );
}
