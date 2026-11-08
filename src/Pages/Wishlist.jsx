import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../constants/routes';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-deep flex items-center justify-center mx-auto border border-rose-200">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-noir-900">Your Wishlist is Empty</h1>
          <p className="text-sm text-luxury-600 max-w-md mx-auto">
            Save your beloved cellular serums, lip couture, and fragrances to revisit anytime.
          </p>
        </div>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-noir-900 hover:bg-gold text-white text-xs font-semibold uppercase tracking-widest transition-colors shadow-md"
        >
          <span>Explore Boutique</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-luxury-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Saved Curations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900 mt-1">
            Your Wishlist ({wishlist.length})
          </h1>
        </div>
        <button
          onClick={handleMoveAllToCart}
          className="px-6 py-2.5 rounded-full bg-noir-900 hover:bg-gold text-white text-xs font-semibold uppercase tracking-widest transition-colors shadow-sm"
        >
          Move All to Shopping Bag
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl border border-luxury-200/80 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-luxury transition-all"
          >
            <div className="relative aspect-square overflow-hidden bg-luxury-50">
              <Link to={`/products/${item._id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-luxury-500 hover:text-rose-deep shadow-sm transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-luxury-500 tracking-wider">
                  {item.brand}
                </span>
                <Link to={`/products/${item._id}`}>
                  <h3 className="font-serif text-sm font-bold text-noir-900 line-clamp-1 hover:text-gold transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="font-serif font-bold text-sm text-noir-900 mt-1">
                  ${(item.discountPrice || item.price).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => addToCart(item, 1)}
                className="w-full py-2.5 px-4 rounded-xl bg-noir-900 hover:bg-gold text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
