import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cosmetics_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('cosmetics_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to save wishlist', err);
    }
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => item._id !== product._id));
      showToast(`Removed ${product.name} from your wishlist`, 'info');
    } else {
      setWishlist((prev) => [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.images && product.images.length ? product.images[0] : '',
          stock: product.stock
        }
      ]);
      showToast(`Added ${product.name} to your wishlist`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
    showToast('Item removed from wishlist', 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
