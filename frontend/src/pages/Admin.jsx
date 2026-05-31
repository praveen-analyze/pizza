import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { Navbar } from "../components/Navbar";

const STATUS_STYLES = {
  pending:            { bg: "#FFF8E8", text: "#92620A", border: "#F0D48A",  dot: "#D4A017"  },
  Preparing:          { bg: "#EBF4FF", text: "#1A5C8A", border: "#A8D0F0",  dot: "#2E86C1"  },
  "Out for Delivery": { bg: "#F0EBF8", text: "#5A1A8A", border: "#C8A8F0",  dot: "#7D3C98"  },
  Delivered:          { bg: "#EAFAF0", text: "#1A6B40", border: "#90D8B0",  dot: "#27AE60"  },
};

const TABS = ["Orders", "Add Pizza", "Manage Pizzas", "Customers"];
const TAB_ICONS = { Orders: "📦", "Add Pizza": "➕", "Manage Pizzas": "🍕", Customers: "👥" };

const EMPTY_PIZZA = { name: "", price: "", image: "", category: "" };

function Admin() {
  const [activeTab, setActiveTab] = useState("Orders");
  const [orders, setOrders]       = useState([]);
  const [pizzas, setPizzas]       = useState([]);
  const [pizza, setPizza]         = useState(EMPTY_PIZZA);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [pizzasLoading, setPizzasLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [addLoading, setAddLoading]       = useState(false);
  const [user, setUser]           = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const getOrders = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      // FIXED: Adjusted path to standard global orders route
      const res   = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) getOrders();
  }, [user, getOrders]);

  const getPizzas = useCallback(async () => {
    try {
      setPizzasLoading(true);
      // FIXED: Cleared redundant middleware route segment
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pizzas`);
      setPizzas(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setPizzasLoading(false);
    }
  }, []);

  useEffect(() => {
    getPizzas();
  }, [getPizzas]);

  const getCustomers = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      setCustomersLoading(true);
      const token = await auth.currentUser.getIdToken();
      // FIXED: Adjusted path to standard users administration route
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && activeTab === "Customers") {
      getCustomers();
    }
  }, [user, activeTab, getCustomers]);

  const updateStatus = async (orderId, status) => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      // FIXED: Adjusted target endpoint formatting
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!auth.currentUser) return;
    if (!window.confirm("Delete this order?")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      // FIXED: Cleared base route string syntax
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) =>
    setPizza({ ...pizza, [e.target.name]: e.target.value });

  const addPizza = async (e) => {
    e.preventDefault();
    if (!pizza.name || !pizza.price) return alert("Name and Price are required");
    const isDuplicate = pizzas.some(
      (p) => p.name.trim().toLowerCase() === pizza.name.trim().toLowerCase()
    );
    if (isDuplicate) {
      return alert("A pizza with this name already exists!");
    }
    try {
      setAddLoading(true);
      // FIXED: Adjusted collection targeted endpoint configuration
      await axios.post(`${import.meta.env.VITE_API_URL}/api/pizzas`, {
        ...pizza,
        price: Number(pizza.price),
      });
      alert("Pizza Added Successfully! 🍕");
      setPizza(EMPTY_PIZZA);
      getPizzas();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to add pizza");
    } finally {
      setAddLoading(false);
    }
  };

  const deletePizza = async (id) => {
    if (!window.confirm("Delete this pizza?")) return;
    try {
      // FIXED: Swapped out duplicated nested directory path configuration
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/pizzas/${id}`);
      getPizzas();
    } catch (err) {
      console.log(err);
    }
  };

  const cleanupDuplicates = async () => {
    if (!window.confirm("Do you want to automatically clean up all duplicate pizzas in the database? This keeps only the first entry of each unique pizza name.")) return;
    try {
      // FIXED: Configured database cleanup subpath destination address correctly
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/pizzas/cleanup`);
      alert(res.data.message);
      getPizzas();
    } catch (err) {
      console.log(err);
      alert("Failed to clean up duplicates");
    }
  };

  const stats = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    revenue:   orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const inputSty = { color: "#1A1208", border: "1.5px solid #E8D5B0", backgroundColor: "#FEFAF4" };
  const focusOn = (e) => { e.target.style.borderColor = "#C0392B"; e.target.style.boxShadow = "0 0 0 3px rgba(192,57,43,0.1)"; };
  const focusOff = (e) => { e.target.style.borderColor = "#E8D5B0"; e.target.style.boxShadow = "none"; };

  const Spinner = () => (
    <div className="flex flex-col items-center py-24">
      <div className="w-14 h-14 border-4 border-[#E8D5B0] border-t-[#C0392B] rounded-full animate-spin mb-5" />
      <p className="text-[#A89585] font-medium">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFAF4" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[#C0392B] text-xs font-bold tracking-[0.2em] uppercase mb-2">Control Center</p>
          <h1
            className="text-4xl font-black"
            style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-[#A89585] mt-1.5 font-light">Manage orders, pizzas and your restaurant</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Orders",   value: stats.total,         icon: "📦", bg: "#EBF4FF", accent: "#1A5C8A", border: "#A8D0F0" },
            { label: "Pending",       value: stats.pending,       icon: "⏳", bg: "#FFF8E8", accent: "#92620A", border: "#F0D48A" },
            { label: "Delivered",     value: stats.delivered,     icon: "✅", bg: "#EAFAF0", accent: "#1A6B40", border: "#90D8B0" },
            { label: "Revenue",       value: `₹${stats.revenue}`, icon: "💰", bg: "#FFF5F3", accent: "#C0392B", border: "#F5C0B8" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-5 border"
              style={{ backgroundColor: s.bg, borderColor: s.border }}
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <div
                className="text-2xl font-black mb-0.5"
                style={{ color: s.accent, fontFamily: "'Georgia', serif" }}
              >
                {s.value}
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase" style={{ color: s.accent + "99" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-2xl mb-10 w-fit"
          style={{ backgroundColor: "#F0E8D8", border: "1px solid #E8D5B0" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 flex items-center gap-1.5"
              style={
                activeTab === tab
                  ? { backgroundColor: "#FFFFFF", color: "#1A1208", boxShadow: "0 2px 8px rgba(26,18,8,0.1)" }
                  : { color: "#7A6354" }
              }
            >
              <span>{TAB_ICONS[tab]}</span>
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* ── TAB: ORDERS ── */}
        {activeTab === "Orders" && (
          <div>
            {ordersLoading ? <Spinner /> : orders.length === 0 ? (
              <div
                className="p-16 text-center rounded-2xl border"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC" }}
              >
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}>
                  No Orders Yet
                </h2>
                <p className="text-[#A89585]">Orders placed by customers will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const style = STATUS_STYLES[order.status] || { bg: "#F5F5F5", text: "#555", border: "#DDD", dot: "#999" };
                  return (
                    <div
                      key={order._id}
                      className="rounded-2xl border overflow-hidden"
                      style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 8px rgba(26,18,8,0.05)" }}
                    >
                      {/* Order Header */}
                      <div
                        className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3"
                        style={{ borderColor: "#EDE0CC", backgroundColor: "#FAF5EE" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: style.dot }} />
                          <div>
                            <p className="font-bold text-[15px]" style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}>
                              {order.customerName}
                            </p>
                            <p className="text-xs font-medium" style={{ color: "#A89585" }}>{order.customerEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold border"
                            style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                          >
                            {order.status}
                          </span>
                          <span
                            className="font-black text-lg"
                            style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}
                          >
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Order Body */}
                      <div className="px-6 py-5">
                        <p className="text-sm mb-4" style={{ color: "#7A6354" }}>
                          <span className="font-semibold" style={{ color: "#3D2B1F" }}>Address: </span>
                          {order.deliveryAddress}
                        </p>

                        {order.items?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-5">
                            {order.items.map((item) => (
                              <div
                                key={item._id || item}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                                style={{ backgroundColor: "#FAF5EE", border: "1px solid #EDE0CC" }}
                              >
                                {item.image && (
                                  <img src={`/${item.image}`} alt={item.name} className="w-6 h-6 rounded-lg object-cover" />
                                )}
                                <span className="text-xs font-semibold" style={{ color: "#3D2B1F" }}>
                                  {item.name || "Item"}
                                </span>
                                {item.price && (
                                  <span className="text-[10px] font-bold" style={{ color: "#C0392B" }}>₹{item.price}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Status Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Pending",         status: "pending" },
                            { label: "Preparing",        status: "Preparing" },
                            { label: "Out for Delivery", status: "Out for Delivery" },
                            { label: "Delivered",        status: "Delivered" },
                          ].map((btn) => {
                            const s = STATUS_STYLES[btn.status];
                            const isActive = order.status === btn.status;
                            return (
                              <button
                                key={btn.status}
                                onClick={() => updateStatus(order._id, btn.status)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200"
                                style={{
                                  backgroundColor: s.bg,
                                  color: s.text,
                                  border: `1px solid ${s.border}`,
                                  outline: isActive ? `2px solid ${s.dot}` : "none",
                                  outlineOffset: "2px",
                                }}
                              >
                                {btn.label}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ml-auto"
                            style={{ backgroundColor: "#FFF5F3", color: "#C0392B", border: "1px solid #F5C0B8" }}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ADD PIZZA ── */}
        {activeTab === "Add Pizza" && (
          <div className="max-w-xl">
            <div
              className="rounded-2xl border p-8"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}
            >
              <h2
                className="text-2xl font-black mb-7"
                style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
              >
                Add New Pizza
              </h2>
              <form onSubmit={addPizza} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold mb-2 tracking-wide uppercase" style={{ color: "#7A6354" }}>
                    Pizza Name *
                  </label>
                  <input type="text" name="name" value={pizza.name} onChange={handleChange}
                    placeholder="e.g. Margherita" required className={inputCls} style={inputSty}
                    onFocus={focusOn} onBlur={focusOff} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 tracking-wide uppercase" style={{ color: "#7A6354" }}>
                    Price (₹) *
                  </label>
                  <input type="number" name="price" value={pizza.price} onChange={handleChange}
                    placeholder="e.g. 299" required min="1" className={inputCls} style={inputSty}
                    onFocus={focusOn} onBlur={focusOff} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 tracking-wide uppercase" style={{ color: "#7A6354" }}>
                    Image Filename
                  </label>
                  <input type="text" name="image" value={pizza.image} onChange={handleChange}
                    placeholder="e.g. margherita.jpg" className={inputCls} style={inputSty}
                    onFocus={focusOn} onBlur={focusOff} />
                  <p className="text-[#A89585] text-xs mt-1.5">Place image in the /public folder</p>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 tracking-wide uppercase" style={{ color: "#7A6354" }}>
                    Category
                  </label>
                  <select name="category" value={pizza.category} onChange={handleChange}
                    className={inputCls} style={{ ...inputSty, appearance: "none" }}
                    onFocus={focusOn} onBlur={focusOff}>
                    <option value="">Select category</option>
                    <option value="Veg">🥦 Veg</option>
                    <option value="Non-Veg">🍗 Non-Veg</option>
                    <option value="Special">⭐ Special</option>
                  </select>
                </div>

                {/* Preview */}
                {pizza.name && (
                  <div
                    className="p-4 rounded-xl border"
                    style={{ backgroundColor: "#FAF5EE", borderColor: "#E8D5B0" }}
                  >
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: "#A89585" }}>
                      Preview
                    </p>
                    <div className="flex items-center gap-3">
                      {pizza.image && (
                        <img src={`/${pizza.image}`} alt={pizza.name}
                          className="w-12 h-12 rounded-xl object-cover"
                          style={{ border: "1px solid #EDE0CC" }} />
                      )}
                      <div className="flex-1">
                        <p className="font-bold" style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}>
                          {pizza.name}
                        </p>
                        <p className="font-black text-sm" style={{ color: "#C0392B" }}>
                          {pizza.price ? `₹${pizza.price}` : "—"}
                        </p>
                      </div>
                      {pizza.category && (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: "#C0392B15", color: "#C0392B", border: "1px solid #C0392B30" }}
                        >
                          {pizza.category}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={addLoading}
                  className="w-full py-3.5 text-white font-bold rounded-xl text-[14px] tracking-wide transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: "linear-gradient(135deg, #C0392B, #E85D3A)",
                    boxShadow: "0 6px 20px rgba(192,57,43,0.35)",
                  }}
                >
                  {addLoading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Adding Pizza...
                    </span>
                  ) : "Add Pizza 🍕"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── MANAGE PIZZAS ── */}
        {activeTab === "Manage Pizzas" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold"
                style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
              >
                {pizzas.length} Pizza{pizzas.length !== 1 ? "s" : ""}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={cleanupDuplicates}
                  className="px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200"
                  style={{ backgroundColor: "#FFF5F3", color: "#C0392B", borderColor: "#F5C0B8" }}
                >
                  🧹 Clean Up Duplicates
                </button>
                <button
                  onClick={getPizzas}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200"
                  style={{ backgroundColor: "#F5EFE6", color: "#7A6354", borderColor: "#EDE0CC" }}
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {pizzasLoading ? <Spinner /> : pizzas.length === 0 ? (
              <div
                className="p-16 text-center rounded-2xl border"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC" }}
              >
                <div className="text-6xl mb-4">🍕</div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}>
                  No Pizzas Yet
                </h2>
                <button
                  onClick={() => setActiveTab("Add Pizza")}
                  className="mt-4 px-7 py-3 text-white font-bold rounded-full text-sm transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #C0392B, #E85D3A)", boxShadow: "0 4px 16px rgba(192,57,43,0.3)" }}
                >
                  Add First Pizza
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pizzas.map((p) => (
                  <div
                    key={p._id}
                    className="rounded-2xl border overflow-hidden hover:-translate-y-1 transition-all duration-200 group"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 8px rgba(26,18,8,0.05)" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 30px rgba(26,18,8,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,18,8,0.05)"}
                  >
                    <div className="relative h-40 overflow-hidden" style={{ backgroundColor: "#F5EFE6" }}>
                      {p.image ? (
                        <img
                          src={`/${p.image}`}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">🍕</div>
                      )}
                      {p.category && (
                        <span
                          className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: "#C0392B", color: "#FFFFFF" }}
                        >
                          {p.category}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-bold mb-0.5"
                        style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
                      >
                        {p.name}
                      </h3>
                      <p
                        className="font-black text-lg mb-3"
                        style={{ color: "#C0392B", fontFamily: "'Georgia', serif" }}
                      >
                        ₹{p.price}
                      </p>
                      <button
                        onClick={() => deletePizza(p._id)}
                        className="w-full py-2 text-xs font-bold rounded-xl border transition-all duration-200"
                        style={{ backgroundColor: "#FFF5F3", color: "#C0392B", borderColor: "#F5C0B8" }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {activeTab === "Customers" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold"
                style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}
              >
                {customers.length} Customer{customers.length !== 1 ? "s" : ""}
              </h2>
              <button
                onClick={getCustomers}
                className="px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200"
                style={{ backgroundColor: "#F5EFE6", color: "#7A6354", borderColor: "#EDE0CC" }}
              >
                ↻ Refresh
              </button>
            </div>

            {customersLoading ? <Spinner /> : customers.length === 0 ? (
              <div
                className="p-16 text-center rounded-2xl border"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC" }}
              >
                <div className="text-6xl mb-4">👥</div>
                <h2 className="text-2xl font-bold" style={{ color: "#1A1208", fontFamily: "'Georgia', serif" }}>
                  No Customers Yet
                </h2>
              </div>
            ) : (
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE0CC", boxShadow: "0 2px 8px rgba(26,18,8,0.05)" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr style={{ backgroundColor: "#FAF5EE", borderBottom: "1px solid #EDE0CC" }}>
                        {["Name", "Email", "Phone", "Addresses", "Joined"].map((h) => (
                          <th
                            key={h}
                            className="p-4 text-[11px] font-bold tracking-wider uppercase"
                            style={{ color: "#A89585" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c) => (
                        <tr
                          key={c._id}
                          className="transition-colors"
                          style={{ borderBottom: "1px solid #F0E8D8" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAF5EE"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <td className="p-4 font-bold text-sm" style={{ color: "#1A1208" }}>{c.name}</td>
                          <td className="p-4 text-sm" style={{ color: "#7A6354" }}>{c.email}</td>
                          <td className="p-4 text-sm" style={{ color: "#7A6354" }}>{c.phone || "—"}</td>
                          <td className="p-4 text-xs" style={{ color: "#7A6354" }}>
                            {c.addresses?.length > 0 ? (
                              <ul className="list-disc pl-4 space-y-0.5">
                                {c.addresses.map((addr, i) => <li key={i}>{addr}</li>)}
                              </ul>
                            ) : "—"}
                          </td>
                          <td className="p-4 text-xs" style={{ color: "#A89585" }}>
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;