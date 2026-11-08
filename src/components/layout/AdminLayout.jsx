import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const AdminLayout = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-900 text-gold">
        <p className="font-serif tracking-widest uppercase">Verifying Administrator Access...</p>
      </div>
    );
  }

  // Enforce role-based access control
  if (!isAdmin) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const navItems = [
    { label: 'Executive Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { label: 'Products Management', path: ROUTES.ADMIN_PRODUCTS, icon: Package },
    { label: 'Categories & Lines', path: ROUTES.ADMIN_CATEGORIES, icon: FolderTree },
    { label: 'Orders & Fulfillment', path: ROUTES.ADMIN_ORDERS, icon: ShoppingBag },
    { label: 'Client Accounts', path: ROUTES.ADMIN_CUSTOMERS, icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-[#F4EFEA]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-noir-900 text-luxury-200 border-r border-noir-800 flex flex-col shrink-0">
        
        {/* Admin Header / Brand */}
        <div className="p-6 border-b border-noir-800">
          <Link to={ROUTES.HOME} className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
              LUMIÈRE
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-semibold">
                Control Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gold text-noir-900 font-bold shadow-md'
                    : 'text-luxury-300 hover:bg-noir-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-noir-900' : 'text-gold'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-noir-800 space-y-2">
          <Link
            to={ROUTES.HOME}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-luxury-400 hover:text-gold hover:bg-noir-800 rounded-lg transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>View Public Storefront</span>
          </Link>
          <button
            onClick={() => logout(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-luxury-200/80 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-luxury-500 font-semibold">
              Management Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-right">
              <div>
                <p className="text-xs font-bold text-noir-900">{user?.name}</p>
                <p className="text-[11px] text-luxury-500">{user?.email}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-noir-900 text-gold font-serif font-bold text-xs flex items-center justify-center border border-gold/40">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
