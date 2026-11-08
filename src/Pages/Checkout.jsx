import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { ROUTES } from '../constants/routes';
import { PAYMENT_METHODS } from '../constants/config';

const Checkout = () => {
  const { cartItems, cartSubtotal, shippingCost, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Sophia Laurent',
    phone: user?.phone || '+1 (555) 839-1029',
    street: user?.addresses?.[0]?.street || '450 North Rodeo Drive, Penthouse 4B',
    city: user?.addresses?.[0]?.city || 'Beverly Hills',
    state: user?.addresses?.[0]?.state || 'CA',
    postalCode: user?.addresses?.[0]?.postalCode || '90210',
    country: user?.addresses?.[0]?.country || 'US'
  });

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in or create an account to finalize your order.', 'error');
      navigate(ROUTES.LOGIN);
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your shopping bag is empty.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress,
        paymentMethod
      };

      const res = await orderService.createOrder(orderPayload);
      setConfirmedOrder(res.data);
      clearCart();
      showToast('Your order has been placed successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please verify details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Placed Success Receipt Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-luxury-200 shadow-luxury p-8 sm:p-12 text-center space-y-8 animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <PackageCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
              Order Confirmed & Secured
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900">
              Thank You for Your Patronage
            </h1>
            <p className="text-sm text-luxury-600 max-w-md mx-auto">
              We have received your order #{confirmedOrder._id.slice(-8).toUpperCase()}. A confirmation email and complimentary tracking update have been prepared.
            </p>
          </div>

          <div className="bg-[#FAF8F5] rounded-2xl p-6 text-left space-y-4 border border-luxury-200">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-luxury-500 pb-3 border-b border-luxury-200">
              <span>Order Reference</span>
              <span>#{confirmedOrder._id}</span>
            </div>

            <div className="space-y-3">
              {confirmedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-noir-900">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-serif font-bold text-noir-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-luxury-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-luxury-600">
                <span>Shipping Destination</span>
                <span className="font-medium text-noir-900">
                  {confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city}
                </span>
              </div>
              <div className="flex justify-between text-luxury-600">
                <span>Payment Method</span>
                <span className="font-medium text-noir-900">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-bold text-noir-900 pt-2 border-t border-luxury-100">
                <span>Authoritative Total</span>
                <span className="text-gold-dark text-base">${confirmedOrder.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to={ROUTES.ORDERS}
              className="px-8 py-3.5 rounded-full bg-noir-900 hover:bg-gold text-white hover:text-noir-900 text-xs font-semibold uppercase tracking-widest transition-colors shadow-md"
            >
              View My Orders
            </Link>
            <Link
              to={ROUTES.HOME}
              className="px-8 py-3.5 rounded-full border border-luxury-300 text-noir-900 hover:bg-luxury-100 text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              Return to Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          Secure Fulfillment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900 mt-1">
          Checkout & Dispatch
        </h1>
      </div>

      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>You are currently checking out as a guest. Sign in to save orders to your profile.</span>
          </div>
          <Link to={ROUTES.LOGIN} className="underline font-bold text-amber-950">
            Sign In Now
          </Link>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address Form */}
          <div className="bg-white rounded-2xl border border-luxury-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-luxury-200">
              <Truck className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-lg font-bold text-noir-900">
                1. Delivery & Recipient Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl px-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
                  Contact Phone *
                </label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl px-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl px-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
                  Street Address & Apartment/Suite *
                </label>
                <input
                  type="text"
                  required
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl px-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl px-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl border border-luxury-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-luxury-200">
              <CreditCard className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-lg font-bold text-noir-900">
                2. Select Payment Arrangement
              </h2>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === pm.id
                      ? 'border-gold bg-[#FAF6F0] shadow-sm'
                      : 'border-luxury-200 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)}
                    className="mt-1 text-gold focus:ring-gold"
                  />
                  <div>
                    <span className="text-xs font-bold text-noir-900 block">{pm.name}</span>
                    <span className="text-xs text-luxury-600 block mt-0.5">{pm.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Authoritative Review & Place Order CTA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-luxury-200/80 p-6 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-noir-900 pb-3 border-b border-luxury-200">
              Order Review
            </h3>

            {/* Itemized Snapshot */}
            <div className="max-h-60 overflow-y-auto divide-y divide-luxury-100">
              {cartItems.map((item) => (
                <div key={item.product || item._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="text-luxury-400 font-semibold">{item.quantity}x</span>
                    <span className="text-noir-900 truncate font-medium">{item.name}</span>
                  </div>
                  <span className="font-serif font-bold text-noir-900 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-luxury-200 text-xs">
              <div className="flex justify-between text-luxury-600">
                <span>Authoritative Subtotal</span>
                <span className="font-semibold text-noir-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-luxury-600">
                <span>Complimentary Delivery</span>
                <span className="font-semibold text-noir-900">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-noir-900 pt-3 border-t border-luxury-200">
                <span>Final Total</span>
                <span className="text-xl text-gold-dark font-bold">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full py-4 px-6 rounded-full bg-noir-900 hover:bg-gold text-white hover:text-noir-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-glow flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Securing Transaction...' : 'Place Haute Order'}</span>
            </button>

            <div className="text-[11px] text-luxury-500 text-center space-y-1">
              <p>By placing this order, you authorize server-side authoritative stock reservation.</p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
