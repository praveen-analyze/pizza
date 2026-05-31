import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Navbar } from "../components/Navbar";

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useContext(CartContext);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFAF4" }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
        <div className="mb-8">
          <p className="text-[#C0392B] text-xs font-bold tracking-[0.2em] uppercase mb-2">Review</p>
          <h1
            className="text-4xl font-black"
            style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Your Cart 🛒
          </h1>
          <p className="text-[#A89585] mt-2 text-sm font-medium">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div
            className="p-16 text-center rounded-2xl border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 12px rgba(26,18,8,0.04)" }}
          >
            <div className="text-7xl mb-5">🛒</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
            >
              Your cart is empty
            </h2>
            <p className="text-[#A89585] mb-8 font-light">Looks like you haven&apos;t added any pizzas yet!</p>
            <button
              onClick={() => navigate("/menu")}
              className="px-7 py-3 text-white font-bold rounded-full text-sm tracking-wide transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C0392B, #E85D3A)",
                boxShadow: "0 4px 16px rgba(192,57,43,0.3)",
              }}
            >
              Browse Menu →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EDE0CC",
                  boxShadow: "0 2px 8px rgba(26,18,8,0.05)",
                }}
              >
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: "#F5EFE6", border: "1px solid #EDE0CC" }}
                >
                  <img
                    src={`/${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-[16px] mb-0.5"
                    style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
                  >
                    {item.name}
                  </h3>
                  <p
                    className="font-black text-lg"
                    style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}
                  >
                    ₹{item.price}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 group"
                  style={{ backgroundColor: "#FFF5F3", border: "1px solid #F5C0B8" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFE5E0"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFF5F3"}
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="#C0392B" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Order Summary */}
            <div
              className="p-6 mt-4 rounded-2xl border"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#EDE0CC",
                boxShadow: "0 2px 12px rgba(26,18,8,0.05)",
              }}
            >
              <h3
                className="font-bold text-lg mb-5"
                style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
              >
                Order Summary
              </h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A6354]">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-[#1A1208]">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A6354]">Delivery</span>
                  <span className="font-bold" style={{ color: "#2E7D32" }}>Free</span>
                </div>
                <div
                  className="flex justify-between font-black text-xl pt-4"
                  style={{ borderTop: "1px solid #EDE0CC" }}
                >
                  <span style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}>Total</span>
                  <span style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}>₹{totalPrice}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-4 text-white font-bold rounded-xl text-[15px] tracking-wide transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #C0392B, #E85D3A)",
                  boxShadow: "0 6px 20px rgba(192,57,43,0.35)",
                }}
              >
                Proceed to Checkout →
              </button>
              <button
                onClick={() => navigate("/menu")}
                className="w-full py-3 mt-3 text-sm font-semibold rounded-xl transition-all duration-200 hover:bg-[#F5EFE6]"
                style={{ color: "#7A6354" }}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;