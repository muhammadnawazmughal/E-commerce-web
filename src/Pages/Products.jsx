import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });

  // Extract filters from URL or defaults
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          search: search || undefined,
          category: category || undefined,
          sort: sortBy || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          inStock: inStock ? 'true' : undefined
        };
        const res = await productService.getProducts(params);
        setProducts(res.data || []);
        if (res.meta) {
          setMeta(res.meta);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search, category, sortBy, minPrice, maxPrice, inStock, page]);

  // Filter handlers
  const handleSelectCategory = (catSlug) => {
    const newParams = new URLSearchParams(searchParams);
    if (catSlug) {
      newParams.set('category', catSlug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriceChange = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set('minPrice', min); else newParams.delete('minPrice');
    if (max) newParams.set('maxPrice', max); else newParams.delete('maxPrice');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleToggleInStock = (checked) => {
    const newParams = new URLSearchParams(searchParams);
    if (checked) newParams.set('inStock', 'true'); else newParams.delete('inStock');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Title */}
      <div className="border-b border-luxury-200/80 pb-6 mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
          Haute Formulary Boutique
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900">
            {search ? `Search results for "${search}"` : category ? `Collection: ${category}` : 'The Full Collection'}
          </h1>
          <p className="text-xs text-luxury-500 font-medium">
            Showing {meta.total} exclusive formulas
          </p>
        </div>

        {/* Active Filter Badges */}
        {(search || category || minPrice || maxPrice || inStock) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-luxury-100">
            <span className="text-xs text-luxury-500 font-medium">Active Filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-luxury-300 rounded-full text-xs text-noir-900">
                Search: {search}
                <X className="w-3 h-3 cursor-pointer hover:text-gold" onClick={() => {
                  const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p);
                }} />
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-luxury-300 rounded-full text-xs text-noir-900">
                Category: {category}
                <X className="w-3 h-3 cursor-pointer hover:text-gold" onClick={() => handleSelectCategory('')} />
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-luxury-300 rounded-full text-xs text-noir-900">
                Price: ${minPrice || 0} - ${maxPrice || '∞'}
                <X className="w-3 h-3 cursor-pointer hover:text-gold" onClick={() => handlePriceChange('', '')} />
              </span>
            )}
            {inStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-luxury-300 rounded-full text-xs text-noir-900">
                In-Stock Only
                <X className="w-3 h-3 cursor-pointer hover:text-gold" onClick={() => handleToggleInStock(false)} />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-gold-dark hover:underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-luxury-300 rounded-xl text-xs font-semibold uppercase tracking-wider text-noir-900 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span>Filter & Refine Selection</span>
          </button>
        </div>

        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <ProductFilters
            categories={categories}
            selectedCategory={category}
            onSelectCategory={handleSelectCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            inStockOnly={inStock}
            onToggleInStock={handleToggleInStock}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-luxury-200">
              <button
                disabled={meta.page <= 1}
                onClick={() => handlePageChange(meta.page - 1)}
                className={`p-2 rounded-xl border border-luxury-300 flex items-center justify-center transition-colors ${
                  meta.page <= 1
                    ? 'text-luxury-300 cursor-not-allowed'
                    : 'text-noir-900 hover:bg-luxury-100 hover:border-gold'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                    pageNum === meta.page
                      ? 'bg-noir-900 text-gold shadow-md'
                      : 'border border-luxury-300 text-noir-900 hover:bg-luxury-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => handlePageChange(meta.page + 1)}
                className={`p-2 rounded-xl border border-luxury-300 flex items-center justify-center transition-colors ${
                  meta.page >= meta.totalPages
                    ? 'text-luxury-300 cursor-not-allowed'
                    : 'text-noir-900 hover:bg-luxury-100 hover:border-gold'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-noir-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#FAF8F5] h-full p-6 overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-luxury-200 mb-6">
              <h3 className="font-serif font-bold text-lg text-noir-900">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-luxury-500 hover:text-noir-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductFilters
              categories={categories}
              selectedCategory={category}
              onSelectCategory={(c) => { handleSelectCategory(c); setIsMobileFiltersOpen(false); }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              inStockOnly={inStock}
              onToggleInStock={handleToggleInStock}
              sortBy={sortBy}
              onSortChange={(s) => { handleSortChange(s); setIsMobileFiltersOpen(false); }}
              onResetFilters={() => { handleResetFilters(); setIsMobileFiltersOpen(false); }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
