import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { ArrowLeft, PackageCheck, Truck, MapPin, CreditCard, Clock } from 'lucide-react';
import { ROUTES } from '../constants/routes';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner text="Retrieving order invoice..." />;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-noir-900">Order Record Not Found</h2>
        <Link to={ROUTES.ORDERS} className="text-xs uppercase font-semibold text-gold underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link
        to={ROUTES.ORDERS}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-luxury-600 hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order History</span>
      </Link>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-luxury-200 shadow-luxury overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-luxury-200 bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-bold text-noir-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
            </div>
            <p className="text-xs text-luxury-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-luxury-500 uppercase font-semibold">Total Cost</span>
            <p className="font-serif text-2xl font-bold text-gold-dark">${order.total?.toFixed(2)}</p>
          </div>
        </div>

        {/* Progress Tracker (If not cancelled) */}
        {order.orderStatus !== 'Cancelled' ? (
          <div className="p-8 border-b border-luxury-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-luxury-600 mb-6">
              Fulfillment Status
            </h3>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-luxury-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-gold -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`
                }}
              />
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-noir-900 text-gold ring-4 ring-gold/30'
                          : isPassed
                          ? 'bg-gold text-noir-900'
                          : 'bg-white border-2 border-luxury-300 text-luxury-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                      isCurrent ? 'text-noir-900' : 'text-luxury-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-semibold">
            This order was cancelled. Reserved inventory was returned to available boutique stock.
          </div>
        )}

        {/* Items List */}
        <div className="p-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-luxury-600">
            Purchased Formulas ({order.items?.length})
          </h3>
          <div className="divide-y divide-luxury-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&q=80'}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-luxury-200 bg-luxury-50"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-noir-900">{item.name}</h4>
                    <p className="text-xs text-luxury-500 mt-0.5">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-serif font-bold text-noir-900 text-base">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Meta Grid */}
        <div className="p-8 bg-[#FAF8F5] border-t border-luxury-200 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-noir-900">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Fulfillment Address</span>
            </div>
            <p className="text-luxury-700 leading-relaxed pl-6">
              {order.shippingAddress?.fullName} <br />
              {order.shippingAddress?.street} <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode} <br />
              {order.shippingAddress?.country} <br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-noir-900">
              <CreditCard className="w-4 h-4 text-gold" />
              <span>Payment Details</span>
            </div>
            <div className="text-luxury-700 leading-relaxed pl-6 space-y-1">
              <p>Method: <strong className="text-noir-900">{order.paymentMethod}</strong></p>
              <p>Payment Status: <strong className="text-emerald-700">{order.paymentStatus}</strong></p>
              <p>Delivery Fee: {order.shippingCost === 0 ? 'Complimentary' : `$${order.shippingCost.toFixed(2)}`}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
