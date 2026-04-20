import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('anantam_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('anantam_cart', JSON.stringify(cart));
  }, [cart]);

  const applyCoupon = async (code) => {
    try {
      const res = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setAppliedCoupon(data);
      return { success: true, coupon: data };
    } catch (err) {
      return { success: false, msg: err.message };
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        product_id: product.id, 
        name: product.name, 
        price: product.price, 
        image_url: product.image_url,
        quantity 
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => 
      item.product_id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getCartTotal = (withDiscount = true) => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (!withDiscount || !appliedCoupon) return subtotal;

    if (appliedCoupon.discount_type === 'percent') {
      return subtotal * (1 - appliedCoupon.discount_value / 100);
    } else {
      return Math.max(0, subtotal - appliedCoupon.discount_value);
    }
  };

  const getDiscountAmount = () => {
    const subtotal = getCartTotal(false);
    return subtotal - getCartTotal(true);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      getDiscountAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};
