import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

function AddPizza() {
  const [pizza, setPizza] = useState({ name: "", price: "", image: "", category: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setPizza({ ...pizza, [e.target.name]: e.target.value });

  const addPizza = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("https://pizza-4-d5q4.onrender.com/api/pizzas", {
        ...pizza,
        price: Number(pizza.price),
      });
      alert("Pizza Added! 🍕");
      navigate("/admin");
    } catch (err) {
      console.log(err);
      alert("Failed to add pizza");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-blue-900 mb-8">Add New Pizza</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={addPizza} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pizza Name *</label>
              <input type="text" name="name" value={pizza.name} onChange={handleChange} placeholder="Margherita" required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-blue-800" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹) *</label>
              <input type="number" name="price" value={pizza.price} onChange={handleChange} placeholder="299" required min="1"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-blue-800" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Image Filename</label>
              <input type="text" name="image" value={pizza.image} onChange={handleChange} placeholder="pizza.jpg"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-blue-800" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select name="category" value={pizza.category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-blue-800">
                <option value="">Select category</option>
                <option value="Veg">🥦 Veg</option>
                <option value="Non-Veg">🍗 Non-Veg</option>
                <option value="Special">⭐ Special</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-60">
              {loading ? "Adding..." : "Add Pizza 🍕"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPizza;