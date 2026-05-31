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
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is Empty");
      return;
    }

    if (!address) {
      alert("Please Enter Address");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        alert("Please Login");
        navigate("/login");
        return;
      }

      // FIX 1: Force refresh token to avoid expiry issues
      const token = await user.getIdToken(true);
      const apiURL = import.meta.env.VITE_API_URL || "https://pizza-5-9c5g.onrender.com";

      if (paymentMethod === "cod") {
        const orderData = {
          customerId: user.uid,
          customerName: user.displayName || "Customer",
          customerEmail: user.email,
          items: cart.map((item) => item._id),
          totalAmount,
          status: "pending",
          deliveryAddress: address,
          paymentDetails: {
            method: "COD",
            status: "pending",
          },
        };

        await axios.post(`${apiURL}/api/orders`, orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        try {
          await axios.put(
            `${apiURL}/api/users/address`,
            { address },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.log("Address save failed", err);
        }

        alert("Order Placed Successfully! 🍕");
        clearCart();
        navigate("/");
      } else {
        const razorpayOrderRes = await axios.post(
          `${apiURL}/api/orders/create-razorpay-order`,
          { amount: totalAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { id, amount, currency } = razorpayOrderRes.data;

        const options = {
          // FIX 2: Removed old hardcoded key fallback
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: "Dominoze Bizza",
          description: "Payment for your order",
          order_id: id,

          handler: async function (response) {
            try {
              // FIX 3: Fresh token inside handler (Razorpay modal can take time)
              const freshToken = await user.getIdToken(true);

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

              await axios.post(`${apiURL}/api/orders`, orderData, {
                headers: { Authorization: `Bearer ${freshToken}` },
              });

              try {
                await axios.put(
                  `${apiURL}/api/users/address`,
                  { address },
                  { headers: { Authorization: `Bearer ${freshToken}` } }
                );
              } catch (err) {
                console.log("Address save failed", err);
              }

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
      }
    } catch (error) {
      console.log(error);
      alert(
        "Failed To Initiate Payment: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFAF4" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
        <div className="mb-10">
          <p className="text-[#C0392B] text-xs font-bold tracking-[0.2em] uppercase mb-2">
            Almost There
          </p>
          <h1
            className="text-4xl font-black"
            style={{
              color: "#1A1208",
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.02em",
            }}
          >
            Checkout
          </h1>
          <p className="text-[#A89585] mt-2 font-light">
            Review your order and confirm
          </p>
        </div>

        {/* ===== ORDER ITEMS ===== */}
        <div
          className="rounded-2xl border overflow-hidden mb-5"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#EDE0CC",
            boxShadow: "0 2px 12px rgba(26,18,8,0.05)",
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "#EDE0CC", backgroundColor: "#FAF5EE" }}
          >
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
                  <button
                    onClick={() => navigate("/menu")}
                    className="font-semibold"
                    style={{ color: "#C0392B" }}
                  >
                    Browse menu →
                  </button>
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden"
                      style={{
                        backgroundColor: "#F5EFE6",
                        border: "1px solid #EDE0CC",
                      }}
                    >
                      <img
                        src={
                          item.imageUrl ||
                          (item.image
                            ? item.image.startsWith("http")
                              ? item.image
                              : "/" + item.image
                            : "/pizza.jpg")
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-semibold text-[14px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-black" style={{ color: "#C0392B" }}>
                    ₹{item.price}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== ADDRESS ===== */}
        <div
          className="rounded-2xl border p-6 mb-7"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC" }}
        >
          <h2 className="font-bold mb-4">Delivery Address</h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            className="w-full rounded-xl p-4 text-sm outline-none resize-none"
            style={{ border: "1.5px solid #E8D5B0", backgroundColor: "#FEFAF4" }}
          />
        </div>

        {/* ===== PAYMENT METHOD ===== */}
        <div
          className="rounded-2xl border p-6 mb-7"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC" }}
        >
          <h2 className="font-bold mb-4">Payment Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              className="py-3 px-4 rounded-xl border font-bold text-sm transition-all cursor-pointer animate-none"
              style={{
                borderColor: paymentMethod === "cod" ? "#C0392B" : "#EDE0CC",
                backgroundColor: paymentMethod === "cod" ? "#FFF5F3" : "#FFFFFF",
                color: paymentMethod === "cod" ? "#C0392B" : "#7A6354",
              }}
            >
              💵 Cash on Delivery
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("online")}
              className="py-3 px-4 rounded-xl border font-bold text-sm transition-all cursor-pointer animate-none"
              style={{
                borderColor: paymentMethod === "online" ? "#C0392B" : "#EDE0CC",
                backgroundColor: paymentMethod === "online" ? "#FFF5F3" : "#FFFFFF",
                color: paymentMethod === "online" ? "#C0392B" : "#7A6354",
              }}
            >
              💳 Online Payment
            </button>
          </div>
        </div>

        {/* ===== PLACE ORDER BUTTON ===== */}
        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full py-4 text-white font-bold rounded-xl cursor-pointer disabled:opacity-65"
          style={{ background: "linear-gradient(135deg, #C0392B, #E85D3A)" }}
        >
          {loading ? "Placing Order..." : "Place Order 🍕"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;