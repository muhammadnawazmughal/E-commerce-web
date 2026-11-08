import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Award, Mail, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="bg-noir-900 text-luxury-200 border-t border-luxury-800">
      
      {/* Brand Ethos Pillars */}
      <div className="border-b border-noir-800 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center sm:items-start gap-4 flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-full bg-noir-800 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-white text-base">Cellular Formulations</h4>
              <p className="text-xs text-luxury-400 mt-1 leading-relaxed">
                Biomimetic peptides & active botanicals for clinical efficacy.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-4 flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-full bg-noir-800 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-white text-base">100% Cruelty-Free</h4>
              <p className="text-xs text-luxury-400 mt-1 leading-relaxed">
                Ethically sourced, Leaping Bunny verified, zero animal testing.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-4 flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-full bg-noir-800 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-white text-base">              Delivery across Pakistan</h4>
              <p className="text-xs text-luxury-400 mt-1 leading-relaxed">
                Free delivery on orders over Rs. 3,000.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-4 flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-full bg-noir-800 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-white text-base">Pure Guarantee</h4>
              <p className="text-xs text-luxury-400 mt-1 leading-relaxed">
                30-day effortless returns and dedicated beauty concierge.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-[0.25em] text-white">
                A&S
              </span>
              <p className="text-[10px] tracking-[0.35em] text-gold uppercase font-medium">
                COSMETICS & BEAUTY STORE
              </p>
            </Link>
            <p className="text-sm text-luxury-400 max-w-sm leading-relaxed">
              A&S Cosmetics brings makeup, skincare, fragrance and beauty tools together in one easy-to-shop destination for Pakistan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-noir-800 flex items-center justify-center text-luxury-400 hover:text-gold hover:bg-noir-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-noir-800 flex items-center justify-center text-luxury-400 hover:text-gold hover:bg-noir-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="w-9 h-9 rounded-full bg-noir-800 flex items-center justify-center text-luxury-400 hover:text-gold hover:bg-noir-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-serif font-semibold text-white tracking-wider text-sm mb-4">
              The Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-luxury-400">
              <li>
                <Link to={`${ROUTES.PRODUCTS}?category=skincare`} className="hover:text-gold transition-colors">
                  Cellular Skincare
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.PRODUCTS}?category=makeup-lips`} className="hover:text-gold transition-colors">
                  Velvet Lip Pigments
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.PRODUCTS}?category=fragrance-perfume`} className="hover:text-gold transition-colors">
                  Haute Parfumerie
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.PRODUCTS}?category=hair-care`} className="hover:text-gold transition-colors">
                  Botanical Hair Care
                </Link>
              </li>
              <li>
                <Link to={`${ROUTES.PRODUCTS}?category=bath-body`} className="hover:text-gold transition-colors">
                  Shea Bath & Body
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h5 className="font-serif font-semibold text-white tracking-wider text-sm mb-4">
              Client Service
            </h5>
            <ul className="space-y-2.5 text-xs text-luxury-400">
              <li>
                <Link to={ROUTES.ORDERS} className="hover:text-gold transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to={ROUTES.WISHLIST} className="hover:text-gold transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ACCOUNT} className="hover:text-gold transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <span className="text-luxury-500 cursor-pointer hover:text-gold">
                  Complimentary Consultation
                </span>
              </li>
              <li>
                <span className="text-luxury-500 cursor-pointer hover:text-gold">
                  Shipping & Returns
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h5 className="font-serif font-semibold text-white tracking-wider text-sm mb-2">
              Stay in the glow
            </h5>
            <p className="text-xs text-luxury-400 mb-4 leading-relaxed">
              Get new arrivals, offers and beauty tips in your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to LUMIÈRE Inner Circle.'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-noir-800 border border-luxury-700 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-gold placeholder:text-luxury-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gold hover:bg-gold-hover text-noir-900 rounded-md flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-noir-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-luxury-500">
          <p>© {new Date().getFullYear()} LUMIÈRE Haute Beauté Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Ingredients Sourcing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
