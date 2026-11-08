import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cosmetics_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('cosmetics_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      showToast('This luxury item is currently out of stock.', 'error');
      return;
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product === product._id || item._id === product._id);

      if (existingIndex > -1) {
        const existingItem = prevItems[existingIndex];
        const newQty = existingItem.quantity + quantity;

        if (newQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock.`, 'error');
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty
        };
        showToast(`Updated quantity for ${product.name}`, 'success');
        return updated;
      } else {
        const unitPrice = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice > 0
          ? product.discountPrice
          : product.price;

        const newItem = {
          product: product._id,
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: unitPrice,
          originalPrice: product.price,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          brand: product.brand
        };

        showToast(`Added ${product.name} to cart`, 'success');
        return [...prevItems, newItem];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId || item._id === productId) {
          if (newQuantity > item.stock) {
            showToast(`Cannot exceed maximum available stock (${item.stock}).`, 'error');
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.product === productId || i._id === productId);
      if (item) {
        showToast(`Removed ${item.name} from cart`, 'info');
      }
      return prevItems.filter((i) => i.product !== productId && i._id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cosmetics_cart');
  };

  // Authoritative calculations
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // Seed products use a compact base price; storefront displays and charges use PKR.
  const currencyRate = 280;
  const subtotalInPkr = cartSubtotal * currencyRate;
  const shippingCost = subtotalInPkr >= 3000 || subtotalInPkr === 0 ? 0 : 250;
  const cartSubtotalPkr = subtotalInPkr;
  const cartTotal = cartSubtotalPkr + shippingCost;

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    cartSubtotalPkr,
    shippingCost,
    cartTotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
