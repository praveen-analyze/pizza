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
    if (cart.length === 0) {
      alert("Cart is Empty");
      return;
    }

    if (!address.trim()) {
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

      const apiURL = import.meta.env.VITE_API_URL || "https://pizza-5-9c5g.onrender.com";

      // Step 1: Create the transaction block token inside Razorpay systems via backend
      const razorpayOrderRes = await axios.post(
        `${apiURL}/api/orders/create-razorpay-order`,
        { amount: totalAmount }
      );

      const { id, amount, currency } = razorpayOrderRes.data;

      // Step 2: Open up the interactive overlay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Dominoze Bizza",
        description: "Pizza Order Payment",
        order_id: id,

        handler: async function (response) {
          try {
            // Pack customer identity, order cart contents, and authentication signatures
            const completeOrderData = {
              customerId: user.uid,
              customerName: user.displayName || "Customer",
              customerEmail: user.email,
              items: cart.map((item) => item._id),
              totalAmount,
              deliveryAddress: address,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            // Step 3: Verify security token strings and save directly on server database
            await axios.post(`${apiURL}/api/orders/verify-and-create`, completeOrderData);

            alert("Payment Successful & Order Placed! 🍕");
            clearCart();
            navigate("/");
          } catch (err) {
            console.error("Order processing failure:", err);
            alert(err.response?.data?.message || "Order verification or saving failed.");
          }
        },

        prefill: {
          name: user.displayName || "Customer",
          email: user.email || "customer@gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#C0392B",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        alert("Payment Failed: " + response.error.description);
      });

      rzp.open();
    } catch (error) {
      console.error("Initialization failure:", error);
      alert("Failed To Place Order: " + (error.response?.data?.message || error.message));
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