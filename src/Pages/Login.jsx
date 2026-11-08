import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../constants/config';
import { ROUTES } from '../constants/routes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || ROUTES.HOME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      // toast shown in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (credentials) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl border border-luxury-200 shadow-luxury p-8 sm:p-10 space-y-8 animate-slide-up">
        
        {/* Brand Heading */}
        <div className="text-center space-y-2">
          <Link to={ROUTES.HOME} className="inline-block">
            <span className="font-serif text-3xl font-bold tracking-[0.25em] text-noir-900">
              LUMIÈRE
            </span>
          </Link>
          <h1 className="font-serif text-xl font-bold text-noir-900">Client Identification</h1>
          <p className="text-xs text-luxury-500">
            Enter your credentials to access your private salon & order records.
          </p>
        </div>

        {/* Quick-Fill Demo Buttons */}
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-luxury-200/80 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark block text-center">
            ⚡ Quick-Fill Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill(DEMO_CREDENTIALS.ADMIN)}
              className="px-3 py-2 rounded-xl bg-noir-900 hover:bg-gold text-white hover:text-noir-900 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span>Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(DEMO_CREDENTIALS.CUSTOMER)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-luxury-100 border border-luxury-300 text-noir-900 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-gold" />
              <span>Demo Customer</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxury.com"
                className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
              />
              <Mail className="w-4 h-4 text-luxury-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
              />
              <Lock className="w-4 h-4 text-luxury-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-noir-900 hover:bg-gold text-white hover:text-noir-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Enter Salon'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-luxury-100">
          <p className="text-xs text-luxury-600">
            Do not possess an account yet?{' '}
            <Link to={ROUTES.REGISTER} className="font-bold text-noir-900 hover:text-gold underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
