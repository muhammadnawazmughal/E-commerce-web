import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ROUTES } from '../../constants/routes';

const CartDrawer = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cartItems,
    cartSubtotal,
    cartCount,
    updateQuantity,
    removeFromCart
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-noir-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-luxury-200 animate-slide-left">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-luxury-200 bg-white/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="text-xl font-serif font-bold text-noir-900">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-luxury-500 hover:text-noir-900 rounded-full hover:bg-luxury-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-luxury-100/70 px-6 py-3 border-b border-luxury-200/60">
            <div className="flex justify-between text-xs font-medium text-luxury-800 mb-1.5">
              <span>
                {remainingForFreeShipping > 0
                  ? `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping`
                  : '✨ You unlocked Complimentary Luxury Shipping!'}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-luxury-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gold h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-luxury-100 flex items-center justify-center text-luxury-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-noir-900">Your bag is empty</h4>
                  <p className="text-sm text-luxury-600 mt-1 max-w-xs">
                    Explore our radiant serums, velvet lipsticks, and haute fragrances.
                  </p>
                </div>
                <Link
                  to={ROUTES.PRODUCTS}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-noir-900 text-white text-sm font-medium hover:bg-gold transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product || item._id}
                  className="flex gap-4 p-3.5 bg-white rounded-xl border border-luxury-200/80 shadow-sm"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-luxury-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-luxury-500 font-medium">
                        {item.brand}
                      </span>
                      <h4 className="text-sm font-medium text-noir-900 truncate">
                        {item.name}
                      </h4>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-noir-900 font-serif">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-luxury-400 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-luxury-100">
                      {/* Stepper */}
                      <div className="flex items-center border border-luxury-200 rounded-lg bg-luxury-50/50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          className="p-1 hover:text-noir-900 text-luxury-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-noir-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= item.stock}
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          className={`p-1 transition-colors ${
                            item.quantity >= item.stock
                              ? 'text-luxury-300 cursor-not-allowed'
                              : 'hover:text-noir-900 text-luxury-600'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="text-luxury-400 hover:text-rose-deep p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-luxury-200 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-luxury-600">Subtotal</span>
                <span className="text-xl font-serif font-bold text-noir-900">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-luxury-500">
                Taxes, gift packaging, and shipping options calculated during checkout.
              </p>
              <div className="space-y-2">
                <Link
                  to={ROUTES.CHECKOUT}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-noir-900 hover:bg-gold text-white font-medium transition-all shadow-md group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={ROUTES.CART}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full block text-center py-2.5 px-6 rounded-full border border-luxury-300 text-noir-900 text-sm font-medium hover:bg-luxury-100 transition-colors"
                >
                  View Full Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
