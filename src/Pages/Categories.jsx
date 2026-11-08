import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ROUTES } from '../constants/routes';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Curating haute beauty categories..." fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          The Collections
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-noir-900">
          Curated Beauty Rituals
        </h1>
        <p className="text-sm text-luxury-600 leading-relaxed">
          Explore our distinct realms of active cellular care, botanical hair wellness, bespoke fragrances, and pigmented lip couture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
            className="group relative rounded-3xl overflow-hidden bg-white border border-luxury-200/80 shadow-luxury hover:shadow-2xl transition-all duration-500 flex flex-col justify-end aspect-[4/5]"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-900/95 via-noir-900/40 to-transparent" />

            <div className="relative z-10 p-8 text-white space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-gold-light border border-white/30">
                <Sparkles className="w-3 h-3 text-gold" />
                <span>Haute Line</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold group-hover:text-gold transition-colors">
                {cat.name}
              </h2>
              <p className="text-xs text-luxury-200 line-clamp-2 leading-relaxed font-light">
                {cat.description}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold group-hover:translate-x-1 transition-transform">
                <span>Explore Line</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
