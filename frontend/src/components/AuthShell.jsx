import { useRef } from "react";
import { Link } from "react-router-dom";
import { usePageMotion } from "../motion";

/** Presentation-only frame for Login / Sign up: photo panel + calm form column. */
export function AuthShell({ title, subtitle, image = "/pizza5.jpg", children }) {
  const scope = useRef(null);
  usePageMotion(scope);

  return (
    <div ref={scope} className="min-h-screen grid lg:grid-cols-[1fr_1.05fr] bg-[var(--color-dough)]">
      <div className="relative hidden lg:block overflow-hidden bg-[var(--color-oven)]">
        <img src={image} alt="" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(18_11_5/0.75)] via-transparent to-transparent" aria-hidden="true" />
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2.5 text-[var(--color-dough)] font-display text-xl font-extrabold tracking-[-0.02em]">
          <span aria-hidden="true">🍕</span> Dominoze Bizza
        </Link>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[26rem]">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-10 font-display text-lg font-extrabold tracking-[-0.02em] text-[var(--color-ink)]">
            <span aria-hidden="true">🍕</span> Dominoze Bizza
          </Link>
          <h1 className="t-h1 text-[var(--color-ink)]">{title}</h1>
          <p className="text-[var(--color-muted)] mt-3 mb-9">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Spinner({ label }) {
  return (
    <>
      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
      {label}
    </>
  );
}
