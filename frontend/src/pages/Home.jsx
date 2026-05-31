import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFAF4" }}>
      <Navbar />

      {/* HERO SECTION */}
      <div
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-5 overflow-hidden"
        style={{ backgroundImage: "url('/pizza.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Layered overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0703]/80 via-[#0D0703]/55 to-[#0D0703]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#C0392B]/20 border border-[#C0392B]/30 text-[#F5A58A] text-xs font-bold mb-8 backdrop-blur-sm tracking-[0.12em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A58A] animate-pulse" />
            Fresh & Hot Delivery
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] mb-6"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.025em" }}
          >
            Crafted with{" "}
            <em className="not-italic" style={{ color: "#E85D3A" }}>Passion</em>
            <br />
            &amp; Perfection 🍕
          </h1>

          <p className="mt-4 text-[#D4C5B5] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            Fresh ingredients, incredible flavors, and lightning-fast delivery
            right to your doorstep.
          </p>

          <div className="flex gap-4 items-center justify-center flex-wrap mt-10">
            <button
              onClick={() => navigate("/menu")}
              className="px-8 py-4 text-white font-bold rounded-full text-[15px] tracking-wide transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C0392B, #E85D3A)",
                boxShadow: "0 8px 32px rgba(192,57,43,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset",
              }}
            >
              Order Now →
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full text-[15px] tracking-wide hover:bg-white hover:text-[#1A1208] hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              View Menu
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { number: "50+", label: "Pizza Varieties" },
              { number: "10K+", label: "Happy Customers" },
              { number: "30min", label: "Avg Delivery" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl font-black"
                  style={{ color: "#E85D3A", fontFamily: "'Georgia', serif" }}
                >
                  {stat.number}
                </div>
                <div className="text-[#A89585] text-xs mt-1.5 font-medium tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="py-28 px-5" style={{ backgroundColor: "#FEFAF4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C0392B] text-xs font-bold tracking-[0.2em] uppercase mb-4">Our Promise</p>
            <h2
              className="text-4xl font-black mb-4"
              style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
            >
              Why Choose Us?
            </h2>
            <p className="text-[#7A6354] text-lg max-w-lg mx-auto font-light">
              We're not just a pizza place — we're an experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🍕",
                title: "Premium Ingredients",
                desc: "Only the finest, freshest ingredients make it into our kitchen. No compromises, ever.",
                accent: "#C0392B",
                bg: "#FFF5F3",
                border: "#F5C0B8",
              },
              {
                icon: "⚡",
                title: "Lightning Fast Delivery",
                desc: "Hot pizza at your door in 30 minutes or less — guaranteed fresh every time.",
                accent: "#1A6B8A",
                bg: "#F0F8FC",
                border: "#B0D8EA",
              },
              {
                icon: "⭐",
                title: "5-Star Taste",
                desc: "Rated #1 by thousands of happy customers across the city. The proof is in every bite.",
                accent: "#B07D0A",
                bg: "#FEFBF0",
                border: "#EDD87A",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: feature.bg,
                  borderColor: feature.border,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                  style={{ backgroundColor: feature.accent + "15", border: `1px solid ${feature.accent}22` }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-[#7A6354] leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div
        className="py-24 px-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A1208 0%, #3D2010 50%, #1A1208 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C0392B, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #E85D3A, transparent)", transform: "translate(-40%, 40%)" }} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-[#C0392B]/70 text-xs font-bold tracking-[0.2em] uppercase mb-5">Ready to Order?</p>
          <h2
            className="text-4xl font-black text-white mb-5"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Hungry? Let's Fix That!
          </h2>
          <p className="text-[#A89585] text-lg mb-10 font-light">
            Browse our full menu and find your perfect pizza.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-10 py-4 text-[#1A1208] font-bold rounded-full text-[15px] tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #FEFAF4, #F5E8D0)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            Browse Full Menu
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        className="py-12 text-center border-t"
        style={{ backgroundColor: "#0D0703", borderColor: "#2A1A0E" }}
      >
        <div className="text-3xl mb-3">🍕</div>
        <p
          className="font-bold text-white mb-1.5"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.05em" }}
        >
          Dominoze Bizza
        </p>
        <p className="text-[#6B5040] text-xs tracking-wider">© 2025 Dominoze Bizza. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;