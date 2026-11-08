import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { ROUTES } from '../../constants/routes';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await userService.getDashboardMetrics();
        setMetrics(res.data);
      } catch (err) {
        console.error('Failed to load admin metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <LoadingSpinner text="Compiling executive intelligence..." />;

  const cards = [
    {
      title: 'Gross Revenue',
      value: `$${metrics?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`,
      icon: DollarSign,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Order Volume',
      value: metrics?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Registered Clients',
      value: metrics?.totalCustomers || 0,
      icon: Users,
      color: 'text-gold-dark bg-gold-light/40 border-gold/30'
    },
    {
      title: 'Low Stock Alerts',
      value: metrics?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-rose-700 bg-rose-50 border-rose-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Executive Overview
          </span>
          <h1 className="font-serif text-3xl font-bold text-noir-900 mt-1">
            Store Performance & Operations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.ADMIN_PRODUCTS}
            className="px-4 py-2.5 rounded-xl bg-noir-900 hover:bg-gold text-white hover:text-noir-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Formula</span>
          </Link>
          <Link
            to={ROUTES.ADMIN_ORDERS}
            className="px-4 py-2.5 rounded-xl bg-white border border-luxury-300 hover:bg-luxury-100 text-noir-900 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Fulfillment Queue
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-luxury-200 p-6 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-luxury-500">
                  {card.title}
                </span>
                <p className="font-serif text-2xl font-bold text-noir-900">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Low Stock Alert + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Low Stock Warning Section */}
        <div className="bg-white rounded-2xl border border-luxury-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-luxury-100">
            <div className="flex items-center gap-2 text-noir-900 font-serif font-bold text-base">
              <AlertTriangle className="w-4 h-4 text-rose-deep" />
              <span>Inventory Depletion Warnings</span>
            </div>
            <Link
              to={ROUTES.ADMIN_PRODUCTS}
              className="text-xs text-gold-dark hover:underline font-semibold"
            >
              Manage Catalog
            </Link>
          </div>

          {metrics?.lowStockProducts?.length === 0 ? (
            <p className="text-xs text-emerald-700 italic py-4">All formulas are adequately stocked.</p>
          ) : (
            <div className="divide-y divide-luxury-100">
              {metrics?.lowStockProducts?.map((prod) => (
                <div key={prod._id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-luxury-50 border border-luxury-200"
                    />
                    <div>
                      <p className="font-bold text-noir-900">{prod.name}</p>
                      <p className="text-luxury-500">${prod.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
                      {prod.stock} units left
                    </span>
                    <Link
                      to={ROUTES.ADMIN_PRODUCTS}
                      className="p-1.5 text-luxury-500 hover:text-noir-900"
                      title="Update stock"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-2xl border border-luxury-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-luxury-100">
            <div className="flex items-center gap-2 text-noir-900 font-serif font-bold text-base">
              <Clock className="w-4 h-4 text-gold" />
              <span>Recent Acquisitions</span>
            </div>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              className="text-xs text-gold-dark hover:underline font-semibold"
            >
              View All ({metrics?.totalOrders || 0})
            </Link>
          </div>

          {metrics?.recentOrders?.length === 0 ? (
            <p className="text-xs text-luxury-500 italic py-4">No recent orders recorded.</p>
          ) : (
            <div className="divide-y divide-luxury-100">
              {metrics?.recentOrders?.map((ord) => (
                <div key={ord._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-noir-900">
                      #{ord._id.slice(-8).toUpperCase()} • {ord.userId?.name || 'Guest Client'}
                    </p>
                    <p className="text-luxury-500">
                      {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 0} items
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={ord.orderStatus}>{ord.orderStatus}</Badge>
                    <span className="font-serif font-bold text-noir-900 text-sm">
                      ${ord.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
