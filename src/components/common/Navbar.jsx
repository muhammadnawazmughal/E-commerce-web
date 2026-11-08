import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LogOut,
  Package,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ROUTES } from '../../constants/routes';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Pakistan-focused announcement bar */}
      <div className="bg-[#241719] text-[#FAF5EE] text-xs py-2 px-4 border-b border-[#d9a66b]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="hidden sm:flex items-center gap-2 text-gold-light">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Beauty essentials, delivered across Pakistan</span>
          </div>
          <div className="mx-auto sm:mx-0 text-center text-xs tracking-wider">
            Free delivery on orders over <span className="text-gold font-semibold">Rs. 3,000</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-luxury-300 text-[11px] uppercase tracking-widest">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Original Products</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-header shadow-elevated border-b border-luxury-200/80 py-3.5'
            : 'bg-[#FCFAF7] border-b border-luxury-200/50 py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-noir-900 hover:text-gold transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link to={ROUTES.HOME} className="flex flex-col items-center group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-noir-900 group-hover:text-gold transition-colors">
                A&S
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-luxury-600 font-sans -mt-1 font-semibold">
                COSMETICS & BEAUTY
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to={ROUTES.HOME}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  location.pathname === ROUTES.HOME
                    ? 'text-gold font-semibold'
                    : 'text-noir-800 hover:text-gold'
                }`}
              >
                Home
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  location.pathname === ROUTES.PRODUCTS
                    ? 'text-gold font-semibold'
                    : 'text-noir-800 hover:text-gold'
                }`}
              >
                Shop
              </Link>
              <Link
                to={`${ROUTES.PRODUCTS}?category=skincare`}
                className="text-sm font-medium tracking-wide text-noir-800 hover:text-gold transition-colors"
              >
                Skincare
              </Link>
              <Link
                to={`${ROUTES.PRODUCTS}?category=makeup-lips`}
                className="text-sm font-medium tracking-wide text-noir-800 hover:text-gold transition-colors"
              >
                Makeup
              </Link>
              <Link
                to={`${ROUTES.PRODUCTS}?category=fragrance-perfume`}
                className="text-sm font-medium tracking-wide text-noir-800 hover:text-gold transition-colors"
              >
                Fragrance
              </Link>
              <Link
                to={ROUTES.CATEGORIES}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  location.pathname === ROUTES.CATEGORIES
                    ? 'text-gold font-semibold'
                    : 'text-noir-800 hover:text-gold'
                }`}
              >
                Categories
              </Link>
            </nav>

            {/* Right Action Icons & Search */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-64">
                <input
                  type="text"
                  placeholder="Search serums, fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/80 border border-luxury-200 rounded-full focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-noir-900 placeholder:text-luxury-400"
                />
                <Search className="w-3.5 h-3.5 text-luxury-400 absolute left-3 top-2.5 pointer-events-none" />
              </form>

              {/* Wishlist Icon */}
              <Link
                to={ROUTES.WISHLIST}
                className="relative p-2 text-noir-800 hover:text-gold transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-deep text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Icon */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 text-noir-800 hover:text-gold transition-colors"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-noir-900 text-gold text-[10px] font-bold rounded-full flex items-center justify-center border border-gold/40">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-luxury-100 transition-colors focus:outline-none"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-gold/50"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-noir-900 text-gold flex items-center justify-center text-xs font-semibold">
                        {user?.name?.[0] || 'U'}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-luxury-600 hidden sm:block" />
                  </button>
                ) : (
                  <Link
                    to={ROUTES.LOGIN}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-luxury-300 text-noir-900 hover:border-gold hover:text-gold transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {isUserMenuOpen && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-luxury border border-luxury-200 py-2 z-50 animate-slide-up">
                    <div className="px-4 py-2 border-b border-luxury-100">
                      <p className="text-xs font-medium text-luxury-500">Signed in as</p>
                      <p className="text-sm font-semibold text-noir-900 truncate">{user?.name}</p>
                      <p className="text-xs text-luxury-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gold/20 text-gold-dark text-[10px] font-bold uppercase rounded-md tracking-wider">
                          Administrator
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to={ROUTES.ADMIN_DASHBOARD}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-noir-900 hover:bg-luxury-100 text-gold font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4 text-gold" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                      <Link
                        to={ROUTES.ACCOUNT}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-noir-900 hover:bg-luxury-100"
                      >
                        <User className="w-4 h-4 text-luxury-500" />
                        <span>My Profile & Addresses</span>
                      </Link>
                      <Link
                        to={ROUTES.ORDERS}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-noir-900 hover:bg-luxury-100"
                      >
                        <Package className="w-4 h-4 text-luxury-500" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to={ROUTES.WISHLIST}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-noir-900 hover:bg-luxury-100"
                      >
                        <Heart className="w-4 h-4 text-luxury-500" />
                        <span>Saved Wishlist ({wishlistCount})</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-luxury-100">
                      <button
                        onClick={() => logout(true)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-deep hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-luxury-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-luxury-300 rounded-lg focus:outline-none focus:border-gold"
              />
              <Search className="w-4 h-4 text-luxury-400 absolute left-3 top-3" />
            </form>

            <nav className="flex flex-col space-y-3 pt-2">
              <Link to={ROUTES.HOME} className="text-sm font-medium text-noir-900 hover:text-gold py-1">
                Home
              </Link>
              <Link to={ROUTES.PRODUCTS} className="text-sm font-medium text-noir-900 hover:text-gold py-1">
                All Products
              </Link>
              <Link to={`${ROUTES.PRODUCTS}?category=skincare`} className="text-sm font-medium text-noir-900 hover:text-gold py-1">
                Skincare Collection
              </Link>
              <Link to={`${ROUTES.PRODUCTS}?category=makeup-lips`} className="text-sm font-medium text-noir-900 hover:text-gold py-1">
                Makeup & Lips
              </Link>
              <Link to={`${ROUTES.PRODUCTS}?category=fragrance-perfume`} className="text-sm font-medium text-noir-900 hover:text-gold py-1">
                Haute Parfumerie
              </Link>
              <Link to={ROUTES.CATEGORIES} className="text-sm font-medium text-noir-900 hover:text-gold py-1">
                All Categories
              </Link>
              {isAdmin && (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="text-sm font-bold text-gold hover:text-noir-900 py-1 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
