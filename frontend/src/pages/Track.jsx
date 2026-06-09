import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";

const STATUS_CONFIG = {
  pending:            { bg: "#FFF8E8", text: "#92620A", border: "#F0D48A", label: "Pending" },
  Preparing:          { bg: "#EBF4FF", text: "#1A5C8A", border: "#A8D0F0", label: "Preparing" },
  "Out for Delivery": { bg: "#F0EBF8", text: "#5A1A8A", border: "#C8A8F0", label: "Out for Delivery" },
  Delivered:          { bg: "#EAFAF0", text: "#1A6B40", border: "#90D8B0", label: "Delivered" },
};

const STEPS = ["pending", "Preparing", "Out for Delivery", "Delivered"];
const STEP_LABELS = ["Ordered", "Preparing", "On the Way", "Delivered"];

function Track() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await axios.get(`${apiURL}/api/orders/my/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Tracking Fetch Error:", error);
        setError("Failed to fetch live order tracking updates.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, token]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFAF4" }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
        <div className="mb-10">
          <p className="text-[#C0392B] text-xs font-bold tracking-[0.2em] uppercase mb-2">Live Updates</p>
          <h1
            className="text-4xl font-black"
            style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            My Orders 📦
          </h1>
          <p className="text-[#A89585] mt-2 font-light">Track all your past and current orders</p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center py-24">
            <div className="w-14 h-14 border-4 border-[#E8D5B0] border-t-[#C0392B] rounded-full animate-spin mb-5" />
            <p className="text-[#A89585] font-medium">Loading orders...</p>
          </div>
        )}

        {/* Backend Error Alert Box */}
        {error && !loading && (
          <div
            className="max-w-md mx-auto p-6 rounded-2xl text-center border mb-6"
            style={{ backgroundColor: "#FFF5F3", borderColor: "#F5C0B8" }}
          >
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-[#C0392B] font-semibold text-sm">{error}</p>
          </div>
        )}

        {/* Empty State Banner */}
        {!loading && !error && orders.length === 0 && (
          <div
            className="p-16 text-center rounded-2xl border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 12px rgba(26,18,8,0.04)" }}
          >
            <div className="text-6xl mb-5">📦</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
            >
              No Orders Yet
            </h2>
            <p className="text-[#A89585] mb-8 font-light">You haven&apos;t placed any orders. Start ordering now!</p>
            <a
              href="/menu"
              className="inline-block px-7 py-3 text-white font-bold rounded-full text-sm tracking-wide transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C0392B, #E85D3A)",
                boxShadow: "0 4px 16px rgba(192,57,43,0.3)",
              }}
            >
              Order Now →
            </a>
          </div>
        )}

        {/* Order History */}
        {!loading && !error && (
          <div className="space-y-5">
            {orders.map((order, idx) => {
              const statusConf = STATUS_CONFIG[order.status] || { bg: "#F5F5F5", text: "#555", border: "#DDD", label: order.status };
              const currentStepIdx = STEPS.indexOf(order.status);

              return (
                <div
                  key={order._id}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#EDE0CC",
                    boxShadow: "0 2px 12px rgba(26,18,8,0.06)",
                  }}
                >
                  {/* Order Header */}
                  <div
                    className="px-6 py-4 border-b flex items-center justify-between"
                    style={{ borderColor: "#EDE0CC", backgroundColor: "#FAF5EE" }}
                  >
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: "#A89585" }}>
                        Order #{orders.length - idx}
                      </p>
                      <p className="text-sm font-medium" style={{ color: "#7A6354" }}>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                    <span
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold border"
                      style={{ backgroundColor: statusConf.bg, color: statusConf.text, borderColor: statusConf.border }}
                    >
                      {statusConf.label}
                    </span>
                  </div>

                  {/* Order Body */}
                  <div className="px-6 py-5">
                    {order.items && order.items.length > 0 && (
                      <div className="mb-5">
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: "#A89585" }}>Items</p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item) => (
                            <div
                              key={item._id || item}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                              style={{ backgroundColor: "#FAF5EE", border: "1px solid #EDE0CC" }}
                            >
                              {(item.imageUrl || item.image) && (
                                <img
                                  src={item.imageUrl || (item.image ? (item.image.startsWith("http") ? item.image : "/" + item.image) : "/pizza.jpg")}
                                  alt={item.name}
                                  className="w-6 h-6 rounded-lg object-cover"
                                />
                              )}
                              <span className="text-xs font-semibold" style={{ color: "#3D2B1F" }}>
                                {item.name || "Item"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#A89585" }}>
                          Delivery Address
                        </p>
                        <p className="text-sm font-medium" style={{ color: "#3D2B1F", maxWidth: "280px" }}>
                          {order.deliveryAddress || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: "#A89585" }}>Total</p>
                        <p
                          className="text-2xl font-black"
                          style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}
                        >
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Progress tracking */}
                    <div>
                      <div className="flex items-center">
                        {STEPS.map((step, i) => {
                          const active = i <= currentStepIdx;
                          const isLast = i === STEPS.length - 1;
                          return (
                            <div key={step} className="flex items-center flex-1 last:flex-none">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300"
                                style={{ backgroundColor: active ? "#C0392B" : "#E8D5B0" }}
                              />
                              {!isLast && (
                                <div
                                  className="flex-1 h-0.5 mx-1 transition-all duration-500"
                                  style={{ backgroundColor: active ? "#C0392B" : "#E8D5B0" }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2">
                        {STEP_LABELS.map((label, i) => (
                          <span
                            key={label}
                            className="text-[10px] font-semibold"
                            style={{ color: i <= currentStepIdx ? "#C0392B" : "#A89585" }}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
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

export default Track;