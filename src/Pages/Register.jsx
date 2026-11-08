import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({ name, email, password, phone });
      navigate(ROUTES.HOME);
    } catch (err) {
      // toast shown in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl border border-luxury-200 shadow-luxury p-8 sm:p-10 space-y-8 animate-slide-up">
        
        <div className="text-center space-y-2">
          <Link to={ROUTES.HOME} className="inline-block">
            <span className="font-serif text-3xl font-bold tracking-[0.25em] text-noir-900">
              LUMIÈRE
            </span>
          </Link>
          <h1 className="font-serif text-xl font-bold text-noir-900">Client Membership</h1>
          <p className="text-xs text-luxury-500">
            Create your account to unlock curated formulations and order archives.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
              />
              <User className="w-4 h-4 text-luxury-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
              Email Address *
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
            <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
              />
              <Phone className="w-4 h-4 text-luxury-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
              Password (Min. 6 Characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
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
            <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-luxury-100">
          <p className="text-xs text-luxury-600">
            Already possess an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-bold text-noir-900 hover:text-gold underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
