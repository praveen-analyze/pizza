import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { useRef } from "react";
import { usePageMotion } from "../motion";
import { CartIcon, ArrowRight } from "../components/Icons";

function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const scope = useRef(null);
  usePageMotion(scope);

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

      if (!user || !token) {
        alert("Please Login");
        navigate("/login");
        return;
      }

      const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      // Step 1: Create the transaction block token inside Razorpay systems via backend
      const razorpayOrderRes = await axios.post(
        `${apiURL}/api/orders/create-razorpay-order`,
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
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
              customerId: user._id,
              customerName: user.name || "Customer",
              customerEmail: user.email,
              items: cart.map((item) => item._id),
              totalAmount,
              deliveryAddress: address,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            // Step 3: Verify security token strings and save directly on server database
            await axios.post(`${apiURL}/api/orders/verify-and-create`, completeOrderData, {
              headers: { Authorization: `Bearer ${token}` }
            });

            alert("Payment Successful & Order Placed! 🍕");
            clearCart();
            navigate("/");
          } catch (err) {
            console.error("Order processing failure:", err);
            alert(err.response?.data?.message || "Order verification or saving failed.");
          }
        },

        prefill: {
          name: user.name || "Customer",
          email: user.email || "customer@example.com",
          contact: user.phone || "9999999999",
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
    <div ref={scope} className="min-h-screen bg-[var(--color-dough)]">
      <Navbar />

      <div className="container-x max-w-5xl pt-12 sm:pt-16 pb-24">
        <header className="mb-8 sm:mb-10">
          <h1 className="t-h1 text-[var(--color-ink)]">Checkout</h1>
          <p className="text-[var(--color-muted)] mt-2">Almost there — review your order and confirm</p>
        </header>

        <div className="grid lg:grid-cols-[1fr_24rem] gap-6 lg:gap-10 items-start">
          {/* ===== ORDER ITEMS ===== */}
          <section className="panel overflow-hidden lg:order-2 lg:sticky lg:top-24">
            <h2 className="px-6 py-4 font-display text-[1.125rem] font-bold tracking-[-0.015em] text-[var(--color-ink)] border-b border-[var(--color-sand-soft)] bg-[var(--color-crust)]">
              Order Items
            </h2>

            <div className="divide-y divide-[var(--color-sand-soft)]">
              {cart.length === 0 ? (
                <div className="px-6 py-10 text-center text-[var(--color-muted)]">
                  <CartIcon className="w-9 h-9 mx-auto mb-3 text-[var(--color-sand)]" />
                  <p>
                    Your cart is empty.{" "}
                    <button
                      onClick={() => navigate("/menu")}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--color-tomato)] underline-offset-4 hover:underline min-h-[44px]"
                    >
                      Browse menu <ArrowRight className="w-4 h-4" />
                    </button>
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="px-6 py-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[var(--color-crust)]">
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
                          width="48"
                          height="48"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-[0.9375rem] truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="t-price text-[1.0625rem]">
                      ₹{item.price}
                    </span>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="px-6 py-4 flex justify-between items-baseline border-t border-[var(--color-sand-soft)] num">
                <span className="font-display font-bold text-[var(--color-ink)]">Total</span>
                <span className="t-price text-[1.5rem]">₹{totalAmount}</span>
              </div>
            )}
          </section>

          {/* ===== ADDRESS ===== */}
          <section className="panel p-6 sm:p-7 lg:order-1">
            <label htmlFor="delivery-address" className="block font-display text-[1.375rem] font-bold tracking-[-0.02em] text-[var(--color-ink)] mb-4">
              Delivery Address
            </label>
            <textarea
              id="delivery-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              autoComplete="street-address"
              className="field resize-none leading-relaxed"
            />

            {/* ===== PLACE ORDER BUTTON ===== */}
            <button
              onClick={placeOrder}
              disabled={loading}
              className="btn btn-primary btn-block mt-6"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
