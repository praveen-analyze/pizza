// ── PizzaDetails.jsx ─────────────────────────────────────────────────────────
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
 
function PizzaDetails() {
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
 
  useEffect(() => {
    const fetchPizza = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pizzas/api/pizzas/${id}`);
        setPizza(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizza();
  }, [id]);
 
  const handleAddToCart = () => {
    addToCart(pizza);
    navigate("/cart");
  };
 
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FEFAF4" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl animate-bounce">🍕</div>
        <div className="w-10 h-10 border-4 border-[#E8D5B0] border-t-[#C0392B] rounded-full animate-spin" />
      </div>
    </div>
  );
 
  if (!pizza) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FEFAF4" }}>
      <div className="text-center">
        <div className="text-6xl mb-5">🍕</div>
        <h2
          className="text-2xl font-bold mb-5"
          style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
        >
          Pizza not found
        </h2>
        <button
          onClick={() => navigate("/menu")}
          className="px-7 py-3 text-white font-bold rounded-full text-sm transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #C0392B, #E85D3A)", boxShadow: "0 4px 16px rgba(192,57,43,0.3)" }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
 
  const categoryColor = {
    Veg:       { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
    "Non-Veg": { bg: "#FBE9E7", text: "#BF360C", border: "#FFAB91" },
    Special:   { bg: "#FFF8E1", text: "#E65100", border: "#FFCC80" },
  };
  const cat = categoryColor[pizza.category] || {};
 
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFAF4" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-2 text-sm font-semibold mb-10 transition-colors"
          style={{ color: "#A89585" }}
          onMouseEnter={e => e.currentTarget.style.color = "#C0392B"}
          onMouseLeave={e => e.currentTarget.style.color = "#A89585"}
        >
          ← Back to Menu
        </button>
 
        <div
          className="rounded-2xl border overflow-hidden md:flex"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 8px 40px rgba(26,18,8,0.09)" }}
        >
          {/* Image */}
          <div className="md:w-1/2 h-72 md:h-auto overflow-hidden" style={{ backgroundColor: "#F5EFE6" }}>
            {pizza.image ? (
              <img
                src={`/${pizza.image}`}
                alt={pizza.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🍕</div>
            )}
          </div>
 
          {/* Details */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            {pizza.category && cat.bg && (
              <span
                className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-5 w-fit border"
                style={{ backgroundColor: cat.bg, color: cat.text, borderColor: cat.border }}
              >
                {pizza.category}
              </span>
            )}
            <h1
              className="text-3xl font-black mb-3"
              style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
            >
              {pizza.name}
            </h1>
            {pizza.description && (
              <p className="text-[#7A6354] leading-relaxed mb-7 font-light">{pizza.description}</p>
            )}
            <div className="mb-8">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: "#A89585" }}>Price</p>
              <div
                className="text-4xl font-black"
                style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}
              >
                ₹{pizza.price}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full py-4 text-white font-bold rounded-xl text-[15px] tracking-wide transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #C0392B, #E85D3A)",
                boxShadow: "0 6px 24px rgba(192,57,43,0.4)",
              }}
            >
              Add to Cart 🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default PizzaDetails;