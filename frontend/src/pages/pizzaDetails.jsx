import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
import { useRef } from "react";
import { usePageMotion, flyToCart } from "../motion";
import { ArrowLeft, CartIcon, AlertIcon } from "../components/Icons";

function PizzaDetails() {
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Track state errors cleanly
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const scope = useRef(null);
  usePageMotion(scope, { mode: "expressive", deps: [loading] });

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        setLoading(true);
        setError("");
        const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await axios.get(`${apiURL}/api/pizzas/${id}`);
        setPizza(res.data);
      } catch (err) {
        console.error("Fetch Pizza Detail Error:", err);
        setError("Could not retrieve pizza details. Please verify your connection.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPizza();
  }, [id]);

  const handleAddToCart = () => {
    if (pizza) {
      addToCart(pizza);
      navigate("/cart");
    }
  };

  const imgSrc = (pizza) =>
    pizza.imageUrl || (pizza.image ? (pizza.image.startsWith("http") ? pizza.image : "/" + pizza.image) : "/pizza.jpg");

  if (loading) return (
    <div ref={scope} className="min-h-screen bg-[var(--color-dough)]">
      <Navbar />
      <div className="container-x py-12 grid md:grid-cols-2 gap-10" aria-busy="true">
        <p className="sr-only" role="status">Loading</p>
        <div className="skeleton aspect-square rounded-[var(--radius-card)]" />
        <div className="flex flex-col justify-center gap-4">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-14 w-3/4" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-5/6" />
          <div className="skeleton h-12 w-32 mt-4" />
          <div className="skeleton h-14 w-full mt-2" />
        </div>
      </div>
    </div>
  );

  if (error || !pizza) return (
    <div ref={scope} className="min-h-screen flex items-center justify-center bg-[var(--color-dough)]">
      <div className="text-center px-4 max-w-md">
        <span className="grid place-items-center w-16 h-16 mx-auto rounded-full bg-[rgb(192_57_43/0.08)] text-[var(--color-tomato)]">
          <AlertIcon className="w-7 h-7" />
        </span>
        <h2 className="t-h2 mt-6 text-[var(--color-ink)]">
          {error ? "Connection Error" : "Pizza Not Found"}
        </h2>
        <p className="text-[var(--color-muted)] mt-3 mb-8">
          {error || "The pizza item you are looking for does not exist or has been modified."}
        </p>
        <button onClick={() => navigate("/menu")} className="btn btn-primary">
          Back to Menu
        </button>
      </div>
    </div>
  );

  const categoryColor = {
    Veg:       { bg: "#E8F5E9", text: "#1E6B23", dot: "#2E7D32" },
    "Non-Veg": { bg: "#FBE9E7", text: "#A3300B", dot: "#BF360C" },
    Special:   { bg: "#FFF3DC", text: "#9A4A00", dot: "#E65100" },
  };
  const cat = categoryColor[pizza.category] || {};

  return (
    <div ref={scope} className="min-h-screen bg-[var(--color-dough)]">
      <Navbar />
      <div className="container-x pt-8 pb-24">
        <button
          onClick={() => navigate("/menu")}
          className="inline-flex items-center gap-2 min-h-[44px] -ml-1 px-1 text-[0.9375rem] font-semibold text-[var(--color-muted)] hover:text-[var(--color-tomato)] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Menu
        </button>

        <div className="mt-6 grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-14 items-center">
          {/* Image */}
          <div data-reveal className="relative overflow-hidden rounded-[var(--radius-card)] aspect-square bg-[var(--color-crust)] shadow-[var(--shadow-md)]">
            {(pizza.imageUrl || pizza.image) ? (
              <img
                src={imgSrc(pizza)}
                alt={pizza.name}
                width="900"
                height="900"
                decoding="async"
                data-img-parallax
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-[var(--color-sand)]">
                <CartIcon className="w-20 h-20" />
              </div>
            )}
          </div>

          {/* Details */}
          <div data-reveal className="flex flex-col">
            {pizza.category && cat.bg && (
              <span className="badge w-fit mb-5" style={{ backgroundColor: cat.bg, color: cat.text }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.dot }} aria-hidden="true" />
                {pizza.category}
              </span>
            )}
            <h1 className="t-h1 text-[var(--color-ink)]">{pizza.name}</h1>
            {pizza.description && (
              <p className="t-lede mt-5 measure">{pizza.description}</p>
            )}
            <div className="mt-8 pt-6 border-t border-[var(--color-sand-soft)]">
              <p className="t-meta">Price</p>
              <p className="t-price text-[var(--step-4)] leading-none mt-2">₹{pizza.price}</p>
            </div>
            <button
              onClick={(e) => {
                flyToCart(e.currentTarget);
                handleAddToCart();
              }}
              className="btn btn-primary btn-block mt-8"
            >
              <CartIcon className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaDetails;
