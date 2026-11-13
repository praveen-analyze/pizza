// Single motion module. Plugins are registered once here; pages import hooks.
// Rules: content is visible by default (hidden states are set by JS only),
// everything runs inside gsap.matchMedia, and useGSAP reverts on unmount.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: "expo.out", duration: 0.9 });

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  rich: "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (pointer: fine)",
};

// Refresh trigger positions once fonts and images have settled (avoids stale offsets).
if (typeof window !== "undefined") {
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh, { once: true });
}

/**
 * Page-level motion.
 * mode "expressive": reveals, batches, parallax, marquee (Home, Menu, Details).
 * mode "calm": a short fade only (Cart, Checkout, forms, Track, Admin).
 * Markup hooks: [data-reveal], [data-batch] children of [data-batch-group],
 * [data-parallax="0.15"], [data-marquee="-1"|"1"], [data-img-parallax] (inside overflow-hidden wrapper).
 */
export function usePageMotion(scope, { mode = "calm", deps = [] } = {}) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      // Route transition: short, non-blocking.
      mm.add(MQ.motion, () => {
        gsap.from(root, { autoAlpha: 0, y: 10, duration: 0.35, ease: "power2.out", clearProps: "all" });
      });
      mm.add(MQ.reduce, () => {
        gsap.from(root, { autoAlpha: 0, duration: 0.2, clearProps: "all" });
      });

      if (mode !== "expressive") return () => mm.revert();

      mm.add(MQ.motion, () => {
        gsap.utils.toArray("[data-reveal]", root).forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 36,
            duration: 1.1,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        const cards = gsap.utils.toArray("[data-batch]", root);
        if (cards.length) {
          gsap.set(cards, { autoAlpha: 0, y: 40 });
          const show = (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.9, overwrite: true });
          ScrollTrigger.batch(cards, {
            start: "top 92%",
            once: true,
            onEnter: show,
            onEnterBack: show,
          });
          // Safety net: if a card is in (or above) the viewport but still hidden
          // after a layout change, reveal it. Content must never stay invisible.
          const sweep = () => {
            const vh = window.innerHeight;
            const stuck = cards.filter(
              (el) => el.isConnected && gsap.getProperty(el, "autoAlpha") < 1 && !gsap.isTweening(el) && el.getBoundingClientRect().top < vh
            );
            if (stuck.length) show(stuck);
          };
          ScrollTrigger.addEventListener("refresh", sweep);
          ScrollTrigger.refresh();
          return () => ScrollTrigger.removeEventListener("refresh", sweep);
        }
      });

      // Scrub effects: no reduced motion, desktop-class pointers.
      mm.add(MQ.rich, () => {
        gsap.utils.toArray("[data-parallax]", root).forEach((el) => {
          const amt = parseFloat(el.dataset.parallax) || 0.15;
          gsap.to(el, {
            yPercent: amt * 100,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true },
          });
        });
        gsap.utils.toArray("[data-marquee]", root).forEach((el) => {
          const dir = parseFloat(el.dataset.marquee) || -1;
          gsap.fromTo(
            el,
            { xPercent: dir < 0 ? 0 : -18 },
            {
              xPercent: dir < 0 ? -18 : 0,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
            }
          );
        });
        gsap.utils.toArray("[data-img-parallax]", root).forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
        gsap.utils.toArray("[data-bg-shift]", root).forEach((el) => {
          gsap.fromTo(
            el,
            { backgroundColor: el.dataset.bgFrom },
            {
              backgroundColor: el.dataset.bgShift,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 80%", end: "top 20%", scrub: true },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope, dependencies: deps, revertOnUpdate: true }
  );
}

/** Masked line-by-line headline reveal. Keeps an aria-label with the original text. */
export function useSplitReveal(ref, { delay = 0.15 } = {}) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
        let split;
        document.fonts.ready.then(() => {
          split = SplitText.create(el, {
            type: "lines,words",
            linesClass: "split-line",
            aria: "hidden",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, { yPercent: 110, duration: 1.15, stagger: 0.045, delay }),
          });
        });
        return () => {
          split?.revert();
          el.removeAttribute("aria-label");
        };
      });
      return () => mm.revert();
    },
    { scope: ref }
  );
}

/** Visual-only add-to-cart feedback: a dot flies to the cart icon, badge bounces. */
export function flyToCart(fromEl) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("cart:bump"));
  const target = document.querySelector("[data-cart-target]:not([hidden])");
  if (!fromEl || !target || window.matchMedia(MQ.reduce).matches) return;
  const a = fromEl.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (!b.width) return;
  const dot = document.createElement("span");
  dot.setAttribute("aria-hidden", "true");
  Object.assign(dot.style, {
    position: "fixed", left: `${a.left + a.width / 2 - 9}px`, top: `${a.top + a.height / 2 - 9}px`,
    width: "18px", height: "18px", borderRadius: "999px", background: "var(--color-tomato)",
    zIndex: 9999, pointerEvents: "none", boxShadow: "0 4px 12px rgb(192 57 43 / .45)",
  });
  document.body.appendChild(dot);
  gsap.to(dot, {
    x: b.left + b.width / 2 - (a.left + a.width / 2),
    y: b.top + b.height / 2 - (a.top + a.height / 2),
    scale: 0.4,
    duration: 0.55,
    ease: "power3.in",
    onComplete: () => dot.remove(),
  });
}
