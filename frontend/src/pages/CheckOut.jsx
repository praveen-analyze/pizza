import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { auth } from "../config/firebase";
import { Navbar } from "../components/Navbar";

function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  const placeOrder = async () => {
    if (cart.length === 0) { alert("Cart is Empty"); return; }
    if (!address) { alert("Please Enter Address"); return; }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) { alert("Please Login"); navigate("/login"); return; }

      const token = await user.getIdToken();

      const razorpayOrderRes = await axios.post(
        "http://localhost:3000/api/orders/create-razorpay-order",
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id: razorpayOrderId, amount: razorpayAmount, currency } = razorpayOrderRes.data;

      const options = {
        key: "rzp_test_SvaPlpRyqzFg9N",
        amount: razorpayAmount,
        currency: currency,
        name: "Dominoze Bizza",
        description: "Payment for your order",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const orderData = {
              customerId: user.uid,
              customerName: user.displayName || "Customer",
              customerEmail: user.email,
              items: cart.map((item) => item._id),
              totalAmount,
              status: "pending",
              deliveryAddress: address,
              paymentDetails: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
            };

            const res = await axios.post(
              "http://localhost:3000/api/orders",
              orderData,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            try {
              await axios.put(
                "http://localhost:3000/api/users/address",
                { address },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            } catch (err) {
              console.log("Failed to save user address", err);
            }

            console.log(res.data);
            alert("Payment Successful & Order Placed! 🍕");
            clearCart();
            navigate("/");
          } catch (error) {
            console.log(error);
            alert("Failed To Complete Order Placement");
          }
        },
        prefill: {
          name: user.displayName || "Customer",
          email: user.email || "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#C0392B" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      alert("Failed To Initiate Payment: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFAF4" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
        <div className="mb-10">
          <p className="text-[#C0392B] text-xs font-bold tracking-[0.2em] uppercase mb-2">Almost There</p>
          <h1
            className="text-4xl font-black"
            style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Checkout
          </h1>
          <p className="text-[#A89585] mt-2 font-light">Review your order and confirm</p>
        </div>

        {/* Order Items */}
        <div
          className="rounded-2xl border overflow-hidden mb-5"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: "#EDE0CC", backgroundColor: "#FAF5EE" }}>
            <h2
              className="font-bold text-[15px]"
              style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
            >
              Order Items
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "#EDE0CC" }}>
            {cart.length === 0 ? (
              <div className="px-6 py-10 text-center text-[#A89585]">
                <div className="text-4xl mb-3">🛒</div>
                <p className="text-sm">
                  Your cart is empty.{" "}
                  <button onClick={() => navigate("/menu")} className="font-semibold" style={{ color: "#C0392B" }}>
                    Browse menu →
                  </button>
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ borderColor: "#EDE0CC" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: "#F5EFE6", border: "1px solid #EDE0CC" }}
                    >
                      <img src={`/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span
                      className="font-semibold text-[14px]"
                      style={{ color: "#1A1208" }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    className="font-black"
                    style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}
                  >
                    ₹{item.price}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Price Summary */}
        <div
          className="rounded-2xl border p-6 mb-5"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}
        >
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#7A6354]">Subtotal</span>
              <span className="font-semibold text-[#1A1208]">₹{totalAmount}</span>
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
              <span style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div
          className="rounded-2xl border p-6 mb-7"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}
        >
          <h2
            className="font-bold text-[15px] mb-4"
            style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
          >
            Delivery Address
          </h2>
          <textarea
            placeholder="Enter your full delivery address including city, landmark, pincode..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            className="w-full rounded-xl p-4 text-sm outline-none resize-none transition-all"
            style={{
              color: "#1A1208",
              border: "1.5px solid #E8D5B0",
              backgroundColor: "#FEFAF4",
              fontFamily: "inherit",
            }}
            onFocus={e => {
              e.target.style.borderColor = "#C0392B";
              e.target.style.boxShadow = "0 0 0 3px rgba(192,57,43,0.1)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "#E8D5B0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full py-4 text-white font-bold rounded-xl text-[15px] tracking-wide transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, #C0392B, #E85D3A)",
            boxShadow: "0 6px 24px rgba(192,57,43,0.4)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2.5">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Placing Order...
            </span>
          ) : (
            "Place Order 🍕"
          )}
        </button>
      </div>
    </div>
  );
}

export default Checkout;