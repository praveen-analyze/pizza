import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { usePageMotion, useSplitReveal, useGSAP, ScrollTrigger, flyToCart } from "../motion";
import { SearchIcon, AlertIcon, PlateIcon, PlusIcon } from "../components/Icons";

const CATEGORY_ORDER = ["Veg", "Non-Veg", "Special"];
const slug = (c) => "cat-" + c.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const scope = useRef(null);
  const headline = useRef(null);
  const [activeCat, setActiveCat] = useState("");

  const handleAddToCart = (pizza) => {
    addToCart(pizza);
    navigate("/cart");
  };

  useEffect(() => {
    const getPizzas = async () => {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}/api/pizzas`);
        setPizzas(res.data);
      } catch (error) {
        console.error("Error Fetching Pizzas:", error);
        setError(`Failed To Load Pizzas: ${error.message}. (Tried URL: ${baseURL})`);
      } finally {
        setLoading(false);
      }
    };
    getPizzas();
  }, []);

  const filtered = pizzas.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const categoryColor = {
    Veg: { bg: "#E8F5E9", text: "#1E6B23", dot: "#2E7D32" },
    "Non-Veg": { bg: "#FBE9E7", text: "#A3300B", dot: "#BF360C" },
    Special: { bg: "#FFF3DC", text: "#9A4A00", dot: "#E65100" },
  };

  // Presentation-only grouping of the same filtered list by its existing category field.
  const groups = [];
  const seen = new Map();
  for (const p of filtered) {
    const c = p.category || "More";
    if (!seen.has(c)) {
      seen.set(c, []);
      groups.push(c);
    }
    seen.get(c).push(p);
  }
  groups.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  const groupKey = groups.join("|");

  usePageMotion(scope, { mode: "expressive", deps: [loading] });
  useSplitReveal(headline);

  // Search changes layout: recompute trigger positions so no card stays hidden.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [search]);

  // Scroll-spy for the category strip.
  useGSAP(
    () => {
      const triggers = groups.map((c) =>
        ScrollTrigger.create({
          trigger: `#${slug(c)}`,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setActiveCat(c),
        })
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { scope, dependencies: [groupKey, loading], revertOnUpdate: true }
  );

  const imgSrc = (pizza) =>
    pizza.imageUrl || (pizza.image ? (pizza.image.startsWith("http") ? pizza.image : "/" + pizza.image) : "/pizza.jpg");

  return (
    <div ref={scope} className="min-h-screen bg-[var(--color-dough)]">
      <Navbar />

      <div className="container-x pt-12 sm:pt-16 pb-24">
        {/* Header */}
        <header className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-10 sm:mb-12">
          <div>
            <h1 ref={headline} className="t-display text-[var(--color-ink)]">Our Menu</h1>
            <p className="t-lede mt-4 measure">Handcrafted daily with love, delivered to your door.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-[22rem]">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search pizzas..."
              aria-label="Search pizzas"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field pl-12 bg-white shadow-[var(--shadow-sm)]"
            />
          </div>
        </header>

        {/* Category strip (sticky, scroll-spy) */}
        {!loading && !error && groups.length > 1 && (
          <nav
            aria-label="Categories"
            className="sticky top-[60px] z-30 -mx-[var(--gutter)] px-[var(--gutter)] py-3 mb-8 bg-[rgb(254_250_244/0.92)] backdrop-blur-md border-b border-[var(--color-sand-soft)]"
          >
            <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
              {groups.map((c) => {
                const active = (activeCat || groups[0]) === c;
                return (
                  <li key={c}>
                    <a
                      href={`#${slug(c)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(slug(c));
                        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                        el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                        setActiveCat(c);
                      }}
                      aria-current={active ? "true" : undefined}
                      className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-[0.9375rem] font-semibold whitespace-nowrap transition-colors duration-200 ${
                        active
                          ? "bg-[var(--color-ink)] text-[var(--color-dough)]"
                          : "text-[var(--color-ink-2)] hover:bg-[var(--color-crust)]"
                      }`}
                    >
                      {categoryColor[c] && (
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor[c].dot }} aria-hidden="true" />
                      )}
                      {c}
                      <span className="num opacity-60 text-[0.8125rem]">{seen.get(c).length}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Loading (skeletons) */}
        {loading && (
          <div aria-busy="true">
            <p className="sr-only" role="status">Loading pizzas...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton aspect-[4/3.4] rounded-[var(--radius-card)]" />
                  <div className="skeleton h-5 w-2/3 mt-4" />
                  <div className="skeleton h-4 w-full mt-3" />
                  <div className="flex justify-between items-center mt-5">
                    <div className="skeleton h-7 w-20" />
                    <div className="skeleton h-11 w-11 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[var(--color-muted)] font-medium mt-10" aria-hidden="true">Loading pizzas...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div role="alert" className="max-w-lg mx-auto alert-error">
            <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <PlateIcon className="w-14 h-14 mx-auto text-[var(--color-sand)]" />
            <h2 className="t-h2 mt-5 text-[var(--color-ink)]">No Pizzas Found</h2>
            <p className="text-[var(--color-muted)] mt-2">Try a different search term</p>
          </div>
        )}

        {/* Pizza grid, grouped by category */}
        {!loading && !error && (
          <div className="space-y-16 sm:space-y-20">
            {groups.map((c) => (
              <section key={c} id={slug(c)} aria-labelledby={`${slug(c)}-h`} className="scroll-mt-36">
                {groups.length > 1 && (
                  <h2 id={`${slug(c)}-h`} className="t-h2 text-[var(--color-ink)] mb-6 sm:mb-8 flex items-baseline gap-3">
                    {c}
                    <span className="num text-[var(--step-0)] font-sans font-semibold text-[var(--color-muted)] tracking-normal">
                      {seen.get(c).length}
                    </span>
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {seen.get(c).map((pizza) => {
                    const cat = categoryColor[pizza.category] || {};
                    return (
                      <article key={pizza._id} data-batch className="group flex flex-col">
                        {/* Image */}
                        <div className="relative overflow-hidden rounded-[var(--radius-card)] aspect-[4/3.4] bg-[var(--color-crust)] shadow-[var(--shadow-sm)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lg)]">
                          <img
                            src={imgSrc(pizza)}
                            alt={pizza.name}
                            loading="lazy"
                            decoding="async"
                            width="640"
                            height="544"
                            data-img-parallax
                            className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 group-hover:saturate-[1.15]"
                          />
                          {pizza.category && cat.bg && (
                            <span className="badge absolute top-3 left-3 shadow-[var(--shadow-sm)]" style={{ backgroundColor: cat.bg, color: cat.text }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.dot }} aria-hidden="true" />
                              {pizza.category}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="pt-4 flex flex-col flex-1">
                          <h3 className="font-display text-[1.3125rem] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
                            {pizza.name}
                          </h3>
                          {pizza.description && (
                            <p className="text-[var(--color-muted)] text-[0.9375rem] mt-1 line-clamp-2 leading-relaxed">{pizza.description}</p>
                          )}
                          <div className="flex items-center justify-between gap-3 mt-auto pt-4">
                            <p>
                              <span className="sr-only">Price </span>
                              <span className="t-price text-[1.625rem] inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                                ₹{pizza.price}
                              </span>
                            </p>
                            <button
                              onClick={(e) => {
                                flyToCart(e.currentTarget);
                                handleAddToCart(pizza);
                              }}
                              className="btn btn-primary btn-sm pl-3.5 pr-4 group/add"
                            >
                              <PlusIcon className="w-[18px] h-[18px] transition-transform duration-300 group-hover/add:rotate-90" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
