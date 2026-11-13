import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { usePageMotion, useSplitReveal, useGSAP, gsap, MQ } from "../motion";
import { ArrowRight, LeafIcon, BoltIcon, StarIcon } from "../components/Icons";

const FEATURES = [
  {
    Icon: LeafIcon,
    title: "Premium Ingredients",
    desc: "Only the finest, freshest ingredients make it into our kitchen. No compromises, ever.",
  },
  {
    Icon: BoltIcon,
    title: "Lightning Fast Delivery",
    desc: "Hot pizza at your door in 30 minutes or less — guaranteed fresh every time.",
  },
  {
    Icon: StarIcon,
    title: "5-Star Taste",
    desc: "Rated #1 by thousands of happy customers across the city. The proof is in every bite.",
  },
];

const STATS = [
  { number: "50+", label: "Pizza Varieties" },
  { number: "10K+", label: "Happy Customers" },
  { number: "30min", label: "Avg Delivery" },
];

const SHOWCASE = ["/pizza2.jpg", "/pizza3.jpg", "/pizza4.jpg", "/pizza5.jpg"];

function Home() {
  const navigate = useNavigate();
  const scope = useRef(null);
  const headline = useRef(null);
  const showcase = useRef(null);
  const track = useRef(null);

  usePageMotion(scope, { mode: "expressive" });
  useSplitReveal(headline);

  // Hero image: scrubbed rotate/scale; lede + CTAs follow the headline.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-hero-follow]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.1, delay: 0.55 });
        gsap.from("[data-hero-pizza]", { autoAlpha: 0, scale: 0.86, rotate: -18, duration: 1.6, delay: 0.1 });
      });
      mm.add(MQ.rich, () => {
        gsap.to("[data-hero-pizza] img", {
          rotate: 40,
          scale: 1.12,
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
        });
        // Horizontal showcase (landing page only, desktop only).
        const t = track.current;
        if (t) {
          gsap.to(t, {
            x: () => -(t.scrollWidth - window.innerWidth + 64),
            ease: "none",
            scrollTrigger: {
              trigger: showcase.current,
              start: "top top",
              end: () => `+=${t.scrollWidth - window.innerWidth}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        }
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div ref={scope} className="min-h-screen bg-[var(--color-dough)]">
      <Navbar />

      {/* HERO */}
      <section data-hero className="relative overflow-hidden">
        <div className="container-x grid lg:grid-cols-[1.05fr_1fr] items-center gap-10 lg:gap-6 pt-10 pb-16 sm:pt-16 lg:pt-12 lg:pb-24 lg:min-h-[calc(100svh-var(--header-h))]">
          <div className="relative z-10 max-w-[38rem]">
            <h1 ref={headline} className="t-display text-[var(--color-ink)]">
              Crafted with <span className="text-[var(--color-tomato)]">Passion</span> &amp;&nbsp;Perfection
            </h1>

            <p data-hero-follow className="t-lede mt-6 measure">
              Fresh ingredients, incredible flavors, and lightning-fast delivery right to your doorstep.
            </p>

            <div data-hero-follow className="flex gap-3 items-center flex-wrap mt-9">
              <button onClick={() => navigate("/menu")} className="btn btn-primary text-base px-7 min-h-[54px] group">
                Order Now
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button onClick={() => navigate("/menu")} className="btn btn-ghost text-base px-7 min-h-[54px]">
                View Menu
              </button>
            </div>

            <p data-hero-follow className="mt-8 inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold text-[var(--color-basil)]">
              <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-[var(--color-basil)] opacity-60 animate-ping" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-[var(--color-basil)]" />
              </span>
              Fresh &amp; Hot Delivery
            </p>
          </div>

          {/* Hero pizza: circular crop of the existing hero photo */}
          <div data-hero-pizza className="relative justify-self-center lg:justify-self-end w-[min(88vw,560px)] aspect-square">
            <div className="absolute inset-[-6%] rounded-full bg-[var(--color-crust)]" aria-hidden="true" />
            <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_30px_80px_rgb(26_18_8/0.28)]">
              <img
                src="/pizza.jpg"
                alt="A freshly baked pizza"
                width="1120"
                height="1120"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover will-change-transform"
              />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-y border-[var(--color-sand-soft)]">
          <dl className="container-x grid grid-cols-3 divide-x divide-[var(--color-sand-soft)]">
            {STATS.map((stat) => (
              <div key={stat.label} data-reveal className="py-6 sm:py-8 px-2 sm:px-6 text-center sm:text-left">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display num text-[clamp(1.75rem,1.2rem+2.6vw,3.25rem)] font-extrabold tracking-[-0.03em] text-[var(--color-ink)] leading-none">
                  {stat.number}
                </dd>
                <dd aria-hidden="true" className="mt-2 text-[0.8125rem] sm:text-[0.9375rem] font-semibold text-[var(--color-muted)]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* MARQUEE — existing copy only */}
      <div className="overflow-hidden py-10 sm:py-14 select-none" aria-hidden="true">
        <p data-marquee="-1" className="whitespace-nowrap font-display font-extrabold tracking-[-0.035em] leading-none text-[clamp(3.5rem,2rem+8vw,9rem)] text-[var(--color-ink)]">
          Fresh &amp; Hot Delivery <span className="text-[var(--color-tomato)]">·</span> Premium Ingredients{" "}
          <span className="text-[var(--color-tomato)]">·</span> 5-Star Taste <span className="text-[var(--color-tomato)]">·</span> Fresh &amp; Hot Delivery
        </p>
      </div>

      {/* SHOWCASE: horizontal on desktop, vertical stack on mobile */}
      <section ref={showcase} aria-label="Our pizzas" className="lg:h-screen lg:flex lg:items-center overflow-hidden">
        <div
          ref={track}
          className="container-x lg:max-w-none lg:w-max lg:px-[var(--gutter)] grid gap-4 sm:grid-cols-2 lg:flex lg:gap-6"
        >
          {SHOWCASE.map((src, i) => (
            <div
              key={src}
              data-reveal
              className={`relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-crust)] aspect-[4/5] lg:aspect-auto lg:h-[72vh] lg:w-[46vh] ${i % 2 ? "lg:translate-y-10" : ""}`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                width="800"
                height="1000"
                data-img-parallax
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-[var(--space-section)]">
        <div className="container-x grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
          <div data-reveal className="lg:sticky lg:top-28 self-start">
            <h2 className="t-h1 text-[var(--color-ink)]">Why Choose Us?</h2>
            <p className="t-lede mt-5 max-w-[30ch]">Our promise: we&apos;re not just a pizza place — we&apos;re an experience.</p>
          </div>

          <ul className="divide-y divide-[var(--color-sand)] border-y border-[var(--color-sand)]">
            {FEATURES.map(({ Icon, title, desc }) => (
              <li key={title} data-reveal className="group grid grid-cols-[auto_1fr] gap-5 sm:gap-8 py-8 sm:py-10">
                <span className="grid place-items-center w-14 h-14 rounded-full bg-[rgb(192_57_43/0.08)] text-[var(--color-tomato)] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
                  <Icon className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-display text-[var(--step-2)] font-bold tracking-[-0.02em] text-[var(--color-ink)]">{title}</h3>
                  <p className="mt-2 text-[var(--color-muted)] measure">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA — background warms from dough to oven while scrolling */}
      <section
        data-bg-shift="#120b05"
        data-bg-from="#fefaf4"
        className="relative overflow-hidden bg-[var(--color-oven)] py-[var(--space-section)]"
      >
        <div className="container-x relative z-10 text-center">
          <h2 data-reveal className="t-display text-[var(--color-dough)] mx-auto max-w-[14ch]">
            Hungry? Let&apos;s Fix&nbsp;That!
          </h2>
          <p data-reveal className="mt-6 text-[var(--step-1)] text-[#d9c6b2] mx-auto max-w-[44ch]">
            Ready to order? Browse our full menu and find your perfect pizza.
          </p>
          <div data-reveal className="mt-10">
            <button onClick={() => navigate("/menu")} className="btn btn-light text-base px-8 min-h-[56px] group">
              Browse Full Menu
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--color-oven)] border-t border-white/10">
        <div className="container-x py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-[-0.02em] text-[var(--color-dough)]">
            <span aria-hidden="true">🍕</span> Dominoze Bizza
          </p>
          <p className="text-[0.875rem] text-[#b5a08c]">© 2025 Dominoze Bizza. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
