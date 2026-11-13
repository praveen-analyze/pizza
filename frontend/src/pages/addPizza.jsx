import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useRef } from "react";
import { usePageMotion } from "../motion";

function AddPizza() {
  // 1. Initialized with a default category if you want, or keep it empty but make it required
  const [pizza, setPizza] = useState({ name: "", price: "", image: "", category: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const scope = useRef(null);
  usePageMotion(scope);

  const handleChange = (e) =>
    setPizza({ ...pizza, [e.target.name]: e.target.value });

  const addPizza = async (e) => {
    e.preventDefault();
    
    // 2. Client-side fallback check just in case
    if (!pizza.category) {
      alert("Please select a pizza category! 🍕");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/pizzas`, {
        ...pizza,
        price: Number(pizza.price),
      });
      alert("Pizza Added! 🍕");
      navigate("/admin");
    } catch (err) {
      console.error("Error adding pizza:", err); // Cleaner logging
      alert(err.response?.data?.message || "Failed to add pizza"); // Dynamic backend error messages
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={scope} className="min-h-screen bg-[var(--color-dough)]">
      <Navbar />
      <div className="container-x max-w-xl pt-12 sm:pt-16 pb-24">
        <h1 className="t-h1 text-[var(--color-ink)] mb-8">Add New Pizza</h1>
        <div className="panel p-6 sm:p-8">
          <form onSubmit={addPizza} className="space-y-5">
            <div>
              <label className="t-label block mb-2">Pizza Name *</label>
              <input type="text" name="name" value={pizza.name} onChange={handleChange} placeholder="Margherita" required
                className="field" />
            </div>
            <div>
              <label className="t-label block mb-2">Price (₹) *</label>
              <input type="number" name="price" value={pizza.price} onChange={handleChange} placeholder="299" required min="1"
                className="field" />
            </div>
            <div>
              <label className="t-label block mb-2">Image Filename</label>
              <input type="text" name="image" value={pizza.image} onChange={handleChange} placeholder="pizza.jpg"
                className="field" />
            </div>
            <div>
              <label className="t-label block mb-2">Category *</label>
              {/* Added required attribute here */}
              <select name="category" value={pizza.category} onChange={handleChange} required
                className="field">
                <option value="" disabled>Select category</option> {/* disabled prevents users re-selecting the placeholder */}
                <option value="Veg">🥦 Veg</option>
                <option value="Non-Veg">🍗 Non-Veg</option>
                <option value="Special">⭐ Special</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-primary btn-block">
              {loading ? "Adding..." : "Add Pizza"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPizza;