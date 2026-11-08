import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../constants/routes';

const Cart = () => {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    shippingCost,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'LUMIERE10') {
      setPromoApplied(true);
      showToast('10% VIP promotion applied!', 'success');
    } else {
      showToast('Invalid promotion code. Try LUMIERE10 for VIP discount.', 'error');
    }
  };

  const discountAmount = promoApplied ? cartSubtotal * 0.1 : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-luxury-100 flex items-center justify-center mx-auto text-luxury-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-noir-900">Your Shopping Bag is Empty</h1>
          <p className="text-sm text-luxury-600 max-w-md mx-auto">
            Discover our haute cellular formulations, velvet pigments, and artisanal parfums.
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
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          Order Review
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900 mt-1">
          Your Shopping Bag ({cartCount})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Cart Item Rows */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-luxury-200/80 shadow-sm overflow-hidden">
            <div className="divide-y divide-luxury-100">
              {cartItems.map((item) => (
                <div key={item.product || item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl bg-luxury-50 shrink-0 border border-luxury-200"
                  />

                  <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                    <span className="text-xs uppercase tracking-widest text-gold font-bold">
                      {item.brand}
                    </span>
                    <h3 className="font-serif text-base font-bold text-noir-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-luxury-600 font-medium">
                      Unit: ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-luxury-300 rounded-xl bg-[#FAF8F5] px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="p-1 text-luxury-600 hover:text-noir-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-noir-900">
                      {item.quantity}
                    </span>
                    <button
                      disabled={item.quantity >= item.stock}
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="p-1 text-luxury-600 hover:text-noir-900 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right font-serif font-bold text-base text-noir-900 w-24">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="text-luxury-400 hover:text-rose-deep p-2 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#FAF8F5] border-t border-luxury-200 flex justify-between items-center text-xs font-medium">
              <Link to={ROUTES.PRODUCTS} className="text-luxury-600 hover:text-noir-900 underline">
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-luxury-500 hover:text-rose-deep"
              >
                Clear Bag
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout Box */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-luxury-200/80 p-6 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-noir-900 pb-3 border-b border-luxury-200">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="VIP Promo (Try LUMIERE10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3.5 py-2 text-xs uppercase text-noir-900 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-noir-900 text-white rounded-xl text-xs font-semibold hover:bg-gold transition-colors"
              >
                Apply
              </button>
            </form>

            {/* Breakdown */}
            <div className="space-y-3 text-xs pt-2">
              <div className="flex justify-between text-luxury-600">
                <span>Subtotal</span>
                <span className="font-semibold text-noir-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-luxury-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-noir-900">
                  {shippingCost === 0 ? 'Complimentary' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>VIP Discount (10%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-serif font-bold text-noir-900 pt-3 border-t border-luxury-200">
                <span>Total Amount</span>
                <span className="text-xl text-gold-dark font-bold">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(ROUTES.CHECKOUT)}
              className="w-full py-4 px-6 rounded-full bg-noir-900 hover:bg-gold text-white hover:text-noir-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-luxury-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>256-Bit Encrypted Secure Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
