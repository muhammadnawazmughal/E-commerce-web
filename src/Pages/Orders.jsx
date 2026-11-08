import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES } from '../constants/routes';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load customer orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-noir-900">Sign In to View Orders</h2>
        <p className="text-sm text-luxury-600">Please authenticate to inspect your past acquisitions and tracking statuses.</p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-noir-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-gold transition-colors"
        >
          <span>Sign In</span>
        </Link>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Retrieving orders repository..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          Account Archival
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900 mt-1">
          Your Order History
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-luxury-200/80 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-luxury-100 flex items-center justify-center mx-auto text-luxury-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-noir-900">No Orders Placed Yet</h3>
          <p className="text-sm text-luxury-600 max-w-sm mx-auto">
            You have not yet acquired any beauty formulas. Browse our curated collection to initiate your ritual.
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-noir-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-gold transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-luxury-200/80 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-luxury-100 gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif font-bold text-noir-900 text-sm">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-xs text-luxury-400">•</span>
                  <span className="text-xs text-luxury-500">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
                  <span className="font-serif font-bold text-noir-900 text-base">
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-luxury-100">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&q=80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-noir-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-luxury-500">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Timeline Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-luxury-500 mb-1.5 uppercase tracking-wider">
                  <span>Lifecycle Progression:</span>
                  <span className="text-noir-900 font-bold">{order.orderStatus}</span>
                </div>
                <div className="w-full bg-luxury-100 rounded-full h-1.5 overflow-hidden flex">
                  {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, i, arr) => {
                    const statusIndex = arr.indexOf(order.orderStatus);
                    const isDone = order.orderStatus === 'Cancelled' ? false : i <= statusIndex;
                    return (
                      <div
                        key={step}
                        className={`flex-1 border-r border-white last:border-0 ${
                          isDone ? 'bg-gold' : 'bg-luxury-200'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-noir-900 hover:text-gold transition-colors uppercase tracking-wider"
                >
                  <span>Inspect Complete Receipt</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
