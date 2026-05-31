import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import PizzaDetails from "./pages/pizzaDetails";
import AddPizza from "./pages/addPizza";
import Checkout from "./pages/CheckOut";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import Track from "./pages/Track";

import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pizza/:id" element={<PizzaDetails />} />
        <Route 
          path="/add-pizza" 
          element={
            <ProtectedRoute>
              <AddPizza />
            </ProtectedRoute>
          } 
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="/track" element={<Track />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;