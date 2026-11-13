import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { useRef } from "react";
import { usePageMotion } from "../motion";
import { AlertIcon, BoxIcon, ArrowRight, CheckIcon } from "../components/Icons";

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
  const scope = useRef(null);
  usePageMotion(scope);

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
    <div ref={scope} className="min-h-screen bg-[var(--color-dough)]">
      <Navbar />

      <div className="container-x max-w-4xl pt-12 sm:pt-16 pb-24">
        <header className="mb-8 sm:mb-10">
          <h1 className="t-h1 text-[var(--color-ink)]">My Orders</h1>
          <p className="text-[var(--color-muted)] mt-2">Live updates — track all your past and current orders</p>
        </header>

        {/* Loading skeletons */}
        {loading && (
          <div aria-busy="true" className="space-y-5">
            <p className="sr-only" role="status">Loading orders...</p>
            {[0, 1].map((i) => (
              <div key={i} className="panel p-6" aria-hidden="true">
                <div className="flex justify-between"><div className="skeleton h-5 w-32" /><div className="skeleton h-7 w-24 rounded-full" /></div>
                <div className="skeleton h-4 w-2/3 mt-6" />
                <div className="skeleton h-2 w-full mt-8" />
              </div>
            ))}
          </div>
        )}

        {/* Backend Error Alert Box */}
        {error && !loading && (
          <div role="alert" className="alert-error max-w-lg mb-6">
            <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty State Banner */}
        {!loading && !error && orders.length === 0 && (
          <div className="panel px-6 py-16 sm:p-20 text-center">
            <span className="grid place-items-center w-20 h-20 mx-auto rounded-full bg-[var(--color-crust)] text-[var(--color-muted)]">
              <BoxIcon className="w-9 h-9" />
            </span>
            <h2 className="t-h2 mt-6 text-[var(--color-ink)]">No Orders Yet</h2>
            <p className="text-[var(--color-muted)] mt-2 mb-8">You haven&apos;t placed any orders. Start ordering now!</p>
            <a href="/menu" className="btn btn-primary">
              Order Now <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Order History */}
        {!loading && !error && (
          <ol className="space-y-5">
            {orders.map((order, idx) => {
              const statusConf = STATUS_CONFIG[order.status] || { bg: "#F5F5F5", text: "#555", border: "#DDD", label: order.status };
              const currentStepIdx = STEPS.indexOf(order.status);

              return (
                <li key={order._id} className="panel overflow-hidden">
                  {/* Order Header */}
                  <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3 border-b border-[var(--color-sand-soft)]">
                    <div>
                      <h2 className="font-display text-[1.25rem] font-bold tracking-[-0.02em] text-[var(--color-ink)] num">
                        Order #{orders.length - idx}
                      </h2>
                      <p className="text-[0.875rem] text-[var(--color-muted)] mt-0.5">
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
                      className="badge text-[0.8125rem] px-3 py-1.5"
                      style={{ backgroundColor: statusConf.bg, color: statusConf.text, boxShadow: `inset 0 0 0 1px ${statusConf.border}` }}
                    >
                      {statusConf.label}
                    </span>
                  </div>

                  {/* Order Body */}
                  <div className="px-5 sm:px-6 py-5">
                    {order.items && order.items.length > 0 && (
                      <div className="mb-5">
                        <p className="t-meta mb-3">Items</p>
                        <ul className="flex flex-wrap gap-2">
                          {order.items.map((item) => (
                            <li
                              key={item._id || item}
                              className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-[var(--color-crust)]"
                            >
                              {(item.imageUrl || item.image) && (
                                <img
                                  src={item.imageUrl || (item.image ? (item.image.startsWith("http") ? item.image : "/" + item.image) : "/pizza.jpg")}
                                  alt={item.name}
                                  width="28"
                                  height="28"
                                  loading="lazy"
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                              )}
                              <span className="text-[0.875rem] font-semibold text-[var(--color-ink-2)]">
                                {item.name || "Item"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-end justify-between gap-6 mb-7">
                      <div className="min-w-0">
                        <p className="t-meta mb-1.5">Delivery Address</p>
                        <p className="text-[0.9375rem] font-medium text-[var(--color-ink-2)] max-w-[32ch]">
                          {order.deliveryAddress || "—"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="t-meta mb-1">Total</p>
                        <p className="t-price text-[1.75rem] leading-none">₹{order.totalAmount}</p>
                      </div>
                    </div>

                    {/* Progress tracking */}
                    <ol className="grid grid-cols-4" aria-label="Order progress">
                      {STEPS.map((step, i) => {
                        const active = i <= currentStepIdx;
                        const current = i === currentStepIdx;
                        const isLast = i === STEPS.length - 1;
                        return (
                          <li key={step} className="relative flex flex-col items-start" aria-current={current ? "step" : undefined}>
                            <div className="flex items-center w-full">
                              <span
                                className={`relative z-10 grid place-items-center w-6 h-6 rounded-full shrink-0 transition-colors duration-300 ${
                                  active ? "bg-[var(--color-tomato)] text-white" : "bg-[var(--color-sand-soft)] text-transparent"
                                } ${current ? "ring-4 ring-[rgb(192_57_43/0.18)]" : ""}`}
                              >
                                <CheckIcon className="w-3.5 h-3.5" />
                              </span>
                              {!isLast && (
                                <span
                                  className="flex-1 h-[3px] mx-1.5 rounded-full transition-colors duration-500"
                                  style={{ backgroundColor: i < currentStepIdx ? "var(--color-tomato)" : "var(--color-sand-soft)" }}
                                />
                              )}
                            </div>
                            <span
                              className={`mt-2 text-[0.75rem] sm:text-[0.8125rem] font-semibold ${
                                active ? "text-[var(--color-tomato)]" : "text-[var(--color-muted)]"
                              }`}
                            >
                              {STEP_LABELS[i]}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

export default Track;
