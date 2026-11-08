import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

const ProductGrid = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-luxury-200/60 overflow-hidden shadow-sm animate-pulse flex flex-col"
          >
            <div className="aspect-square bg-luxury-100/70" />
            <div className="p-4 space-y-3 flex-1">
              <div className="h-3 bg-luxury-200/60 rounded w-1/3" />
              <div className="h-4 bg-luxury-200/80 rounded w-4/5" />
              <div className="h-3 bg-luxury-200/50 rounded w-1/2" />
              <div className="pt-2 border-t border-luxury-100 flex justify-between">
                <div className="h-4 bg-luxury-200/80 rounded w-1/4" />
                <div className="h-3 bg-luxury-200/50 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-luxury-200">
        <div className="w-14 h-14 rounded-full bg-luxury-100 flex items-center justify-center mx-auto text-luxury-500 mb-4">
          <Sparkles className="w-7 h-7 text-gold" />
        </div>
        <h3 className="font-serif text-xl font-bold text-noir-900">
          No luxury formulas found
        </h3>
        <p className="text-sm text-luxury-600 mt-2 max-w-md mx-auto">
          Try broadening your search query, adjusting your price filter, or selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
