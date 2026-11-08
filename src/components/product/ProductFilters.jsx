import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';

const ProductFilters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSortChange,
  onResetFilters
}) => {
  return (
    <div className="bg-white rounded-2xl border border-luxury-200/80 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-luxury-200">
        <div className="flex items-center gap-2 text-noir-900 font-serif font-bold text-base">
          <Filter className="w-4 h-4 text-gold" />
          <span>Refine Selection</span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs text-luxury-500 hover:text-gold transition-colors font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
          Sort Order
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3 py-2 text-xs font-medium text-noir-900 focus:outline-none focus:border-gold"
        >
          <option value="featured">Featured & Iconic</option>
          <option value="newest">New Arrivals</option>
          <option value="rating_desc">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
          Categories
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-noir-900 text-white shadow-sm'
                : 'text-noir-800 hover:bg-luxury-100'
            }`}
          >
            <span>All Formulations</span>
            {!selectedCategory && <Check className="w-3.5 h-3.5 text-gold" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-noir-900 text-white shadow-sm'
                    : 'text-noir-800 hover:bg-luxury-100'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-luxury-700">
          Price Range ($)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange(e.target.value, maxPrice)}
            className="w-1/2 bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3 py-1.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
          />
          <span className="text-luxury-400 text-xs">-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, e.target.value)}
            className="w-1/2 bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3 py-1.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Stock Filter */}
      <div className="pt-2 border-t border-luxury-200">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-noir-900">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-gold focus:ring-gold border-luxury-300 rounded-sm"
          />
          <span>In-Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
