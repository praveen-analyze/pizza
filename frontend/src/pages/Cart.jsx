import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
import { useRef } from "react";
import { usePageMotion } from "../motion";
import { CartIcon, TrashIcon, ArrowRight, ArrowLeft } from "../components/Icons";

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useContext(CartContext);

  const scope = useRef(null);
  usePageMotion(scope);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div ref={scope} className="min-h-screen bg-[var(--color-dough)]">
      <Navbar />

      <div className="container-x max-w-5xl pt-12 sm:pt-16 pb-24">
        <header className="mb-8 sm:mb-10">
          <h1 className="t-h1 text-[var(--color-ink)]">Your Cart</h1>
          <p className="text-[var(--color-muted)] mt-2 font-medium num">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </header>

        {cart.length === 0 ? (
          <div className="panel px-6 py-16 sm:p-20 text-center">
            <span className="grid place-items-center w-20 h-20 mx-auto rounded-full bg-[var(--color-crust)] text-[var(--color-muted)]">
              <CartIcon className="w-9 h-9" />
            </span>
            <h2 className="t-h2 mt-6 text-[var(--color-ink)]">Your cart is empty</h2>
            <p className="text-[var(--color-muted)] mt-2 mb-8">Looks like you haven&apos;t added any pizzas yet!</p>
            <button onClick={() => navigate("/menu")} className="btn btn-primary">
              Browse Menu <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_22rem] gap-6 lg:gap-10 items-start">
            <ul className="panel divide-y divide-[var(--color-sand-soft)]">
              {cart.map((item) => (
                <li key={item.cartItemId} className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[var(--color-crust)]">
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      width="96"
                      height="96"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[1.1875rem] font-bold tracking-[-0.015em] text-[var(--color-ink)] truncate">
                      {item.name}
                    </h3>
                    <p className="t-price text-[1.25rem] mt-0.5">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="icon-btn shrink-0 text-[var(--color-muted)]"
                    title="Remove item"
                    aria-label={`Remove ${item.name}`}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Order Summary */}
            <aside className="panel p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-[1.375rem] font-bold tracking-[-0.02em] text-[var(--color-ink)] mb-5">
                Order Summary
              </h2>
              <dl className="space-y-3 mb-6 num">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Subtotal ({cart.length} items)</dt>
                  <dd className="font-semibold text-[var(--color-ink)]">₹{totalPrice}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Delivery</dt>
                  <dd className="font-bold text-[var(--color-basil)]">Free</dd>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-[var(--color-sand-soft)]">
                  <dt className="font-display text-xl font-bold text-[var(--color-ink)]">Total</dt>
                  <dd className="t-price text-[1.75rem]">₹{totalPrice}</dd>
                </div>
              </dl>
              <button onClick={() => navigate("/checkout")} className="btn btn-primary btn-block">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/menu")}
                className="btn btn-block mt-2 text-[var(--color-muted)] hover:bg-[var(--color-crust)] hover:text-[var(--color-ink)]"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
