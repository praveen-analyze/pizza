import {
  createContext,
  useEffect,
  useState
} from "react";

import { auth } from "../config/firebase";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext =
  createContext();

function CartProvider({
  children
}) {

  const userId =
    auth.currentUser?.uid || "guest";

  // LOAD CART
  const [cart, setCart] =
    useState(() => {

      const savedCart =
        localStorage.getItem(
          `cart_${userId}`
        );

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    });

  // SAVE CART
  useEffect(() => {

    localStorage.setItem(

      `cart_${userId}`,

      JSON.stringify(cart)

    );

  }, [cart, userId]);

  // ADD TO CART
  const addToCart = (pizza) => {

    setCart((prev) => [

      ...prev,

      {
        ...pizza,
        cartItemId:
          Date.now() + Math.random()
      }

    ]);

  };

  // REMOVE FROM CART
  const removeFromCart = (
    cartItemId
  ) => {

    setCart((prev) =>

      prev.filter(

        (item) =>

          item.cartItemId !==
          cartItemId

      )

    );

  };

  // CLEAR CART
  const clearCart = () => {

    setCart([]);

  };

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >

      {children}

    </CartContext.Provider>

  );

}

export default CartProvider;