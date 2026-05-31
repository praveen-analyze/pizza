import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (pizza) => {
    addToCart(pizza);
    navigate("/cart");
  };

  useEffect(() => {
    const getPizzas = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pizzas/api/pizzas`);
        setPizzas(res.data);
      } catch (error) {
        console.log(error);
        setError("Failed To Load Pizzas. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    getPizzas();
  }, []);

  const filtered = pizzas.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryColor = {
    Veg: { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
    "Non-Veg": { bg: "#FBE9E7", text: "#BF360C", border: "#FFAB91" },
    Special: { bg: "#FFF8E1", text: "#E65100", border: "#FFCC80" },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFAF4" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C0392B] text-xs font-bold tracking-[0.2em] uppercase mb-4">Handcrafted Daily</p>
          <h1
            className="text-5xl font-black mb-4"
            style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Our Menu <span className="text-[#C0392B]">🍕</span>
          </h1>
          <p className="text-[#7A6354] text-lg mb-10 font-light">
            Handcrafted with love, delivered to your door.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#A89585]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search pizzas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 rounded-2xl border text-[#1A1208] placeholder-[#A89585] text-sm font-medium outline-none focus:ring-2 focus:ring-[#C0392B]/30 transition-all"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E8D5B0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-[#E8D5B0] border-t-[#C0392B] rounded-full animate-spin mb-5" />
            <p className="text-[#A89585] font-medium">Loading pizzas...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="max-w-md mx-auto p-6 rounded-2xl text-center border"
            style={{ backgroundColor: "#FFF5F3", borderColor: "#F5C0B8" }}
          >
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-[#C0392B] font-semibold text-sm">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-5">🍽️</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
            >
              No Pizzas Found
            </h2>
            <p className="text-[#A89585]">Try a different search term</p>
          </div>
        )}

        {/* Pizza Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((pizza) => {
              const cat = categoryColor[pizza.category] || {};
              return (
                <div
                  key={pizza._id}
                  className="rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EDE0CC",
                    boxShadow: "0 2px 12px rgba(26,18,8,0.06)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 16px 40px rgba(26,18,8,0.14)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,18,8,0.06)"}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-52" style={{ backgroundColor: "#F5EFE6" }}>
                    <img
                      src={`/${pizza.image}`}
                      alt={pizza.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {pizza.category && cat.bg && (
                      <span
                        className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: cat.bg, color: cat.text, border: `1px solid ${cat.border}` }}
                      >
                        {pizza.category}
                      </span>
                    )}
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2
                      className="text-[16px] font-bold mb-1"
                      style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
                    >
                      {pizza.name}
                    </h2>
                    {pizza.description && (
                      <p className="text-[#A89585] text-xs mb-3 line-clamp-2 leading-relaxed">{pizza.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-[11px] text-[#A89585] font-medium block">Price</span>
                        <span
                          className="text-xl font-black"
                          style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}
                        >
                          ₹{pizza.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(pizza)}
                        className="px-4 py-2 text-white rounded-xl text-xs font-bold tracking-wide transition-all duration-200 hover:scale-105"
                        style={{
                          background: "linear-gradient(135deg, #C0392B, #E85D3A)",
                          boxShadow: "0 4px 12px rgba(192,57,43,0.3)",
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;