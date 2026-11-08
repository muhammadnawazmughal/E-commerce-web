import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variantStyles = {
    default: 'bg-luxury-100 text-luxury-800 border-luxury-300',
    gold: 'bg-gold-light/40 text-gold-dark border-gold/40 font-semibold',
    rose: 'bg-rose-petal text-rose-deep border-rose-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    // Order Status Specific Variants
    Pending: 'bg-amber-50 text-amber-800 border-amber-300',
    Confirmed: 'bg-blue-50 text-blue-800 border-blue-300',
    Processing: 'bg-purple-50 text-purple-800 border-purple-300',
    Shipped: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    Cancelled: 'bg-stone-100 text-stone-600 border-stone-300 line-through'
  };

  const selectedStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border ${selectedStyle} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
