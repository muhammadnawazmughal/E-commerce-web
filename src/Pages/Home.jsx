import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, ShieldCheck, HeartHandshake, Leaf, Gem } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES } from '../constants/routes';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts({ isFeatured: true, limit: 4 }),
          categoryService.getCategories()
        ]);
        setFeaturedProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const fallbackCategories = [
    { _id: 'makeup', slug: 'makeup-lips', name: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80' },
    { _id: 'skincare', slug: 'skincare', name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80' },
    { _id: 'fragrance', slug: 'fragrance-perfume', name: 'Fragrance', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80' },
    { _id: 'hair', slug: 'hair-care', name: 'Hair Care', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80' },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-noir-900 text-white">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1800&q=85"
          alt="A&S Cosmetics beauty collection"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 animate-float"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-noir-900 via-noir-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-transparent to-noir-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-left w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-noir-800/80 border border-gold/40 text-gold-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>New season beauty • Made for you</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Your everyday <br />
              <span className="gold-gradient-text italic font-normal">beauty edit.</span>
            </h1>

            <p className="text-base sm:text-lg text-luxury-200 font-light leading-relaxed max-w-lg">
              Discover trusted makeup, skincare and fragrances from A&S Cosmetics. Original products, easy ordering and delivery across Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to={ROUTES.PRODUCTS}
                className="px-8 py-4 rounded-full bg-gold hover:bg-gold-hover text-noir-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-glow flex items-center gap-3 group"
              >
                <span>Shop now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={`${ROUTES.PRODUCTS}?category=skincare`}
                className="px-8 py-4 rounded-full border border-luxury-300/40 hover:border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Shop skincare
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Discovery Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Shop by category
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900 mt-2">
              Find your favourites
            </h2>
          </div>
          <Link
            to={ROUTES.CATEGORIES}
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-noir-900 hover:text-gold flex items-center gap-2 group transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(categories.length ? categories : fallbackCategories).map((category) => (
            <Link
              key={category._id}
              to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-luxury-100 border border-luxury-200/80 shadow-sm hover:shadow-luxury transition-all duration-500 flex flex-col justify-end p-4"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-900/90 via-noir-900/30 to-transparent" />

              <div className="relative z-10 text-white">
                <h3 className="font-serif font-bold text-base sm:text-lg group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
                <span className="text-[10px] tracking-wider uppercase text-luxury-300 flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Shop category</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Iconic Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gold mb-2">
            <Gem className="w-3.5 h-3.5 text-gold" />
            <span>Customer favourites</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900">
            Bestsellers you'll love
          </h2>
          <p className="text-sm text-luxury-600 mt-3 leading-relaxed">
          Everyday essentials picked for Pakistani beauty routines, from glow-boosting skincare to statement lips.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-noir-900 hover:bg-noir-900 hover:text-white text-noir-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Brand Science & Ethical Formulation Banner */}
      <section className="bg-[#FAF5EE] border-y border-luxury-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative rounded-3xl overflow-hidden shadow-luxury border border-luxury-200 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&q=80"
                alt="Formulation Science"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-noir-900/20" />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass-header border border-white/60 shadow-lg">
                <p className="font-serif italic text-noir-900 text-sm sm:text-base font-medium">
                  "True luxury is uncompromising purity. We formulate without parabens, synthetic fillers, or animal derivatives."
                </p>
                <p className="text-xs uppercase tracking-widest text-gold-dark font-bold mt-2">
                  — Dr. Claire Moreau, Head of Formulation
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
                The Science of Radiance
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900 leading-tight">
                Cellular Efficacy Meets French Botanical Heritage
              </h2>
              <p className="text-sm text-luxury-700 leading-relaxed">
                Every LUMIÈRE creation begins with sustainably wild-harvested French botanicals, concentrated into biomimetic complexes that communicate directly with skin cells to boost collagen, replenish moisture barrier lipids, and restore timeless radiance.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="border-l-2 border-gold pl-4 space-y-1">
                  <span className="font-serif text-2xl font-bold text-noir-900">98%</span>
                  <p className="text-xs text-luxury-600">Reported luminous, firmer skin in 7 days</p>
                </div>
                <div className="border-l-2 border-gold pl-4 space-y-1">
                  <span className="font-serif text-2xl font-bold text-noir-900">100%</span>
                  <p className="text-xs text-luxury-600">Vegan, Cruelty-Free & Dermatologist-Approved</p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to={ROUTES.PRODUCTS}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-noir-900 hover:text-gold transition-colors"
                >
                  <span>Learn About Our Ingredients</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Testimonials Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Client Adoration
          </span>
          <h2 className="font-serif text-3xl font-bold text-noir-900 mt-2">
            Words of Devotion
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white border border-luxury-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-serif italic text-noir-900 text-sm leading-relaxed">
                "The Cellular Radiant Glow Serum is truly transformative. In two weeks, my hyperpigmentation faded and my skin took on an ethereal glow."
              </p>
            </div>
            <div className="pt-6 border-t border-luxury-100 mt-6">
              <p className="text-xs font-bold text-noir-900">Camille R.</p>
              <p className="text-[11px] text-luxury-500">Paris, France • Verified Collector</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-luxury-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-serif italic text-noir-900 text-sm leading-relaxed">
                "Grand Soir Eau De Parfum is the most complimented fragrance I have ever worn in my life. Rich amber with bourbon vanilla that lingers for 14 hours."
              </p>
            </div>
            <div className="pt-6 border-t border-luxury-100 mt-6">
              <p className="text-xs font-bold text-noir-900">Alexander V.</p>
              <p className="text-[11px] text-luxury-500">New York, NY • Verified Collector</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-luxury-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-serif italic text-noir-900 text-sm leading-relaxed">
                "The Rouge Couture lipstick is sheer velvet. Zero feathering, intensely saturated pigment, yet it leaves my lips soft and nourished all evening."
              </p>
            </div>
            <div className="pt-6 border-t border-luxury-100 mt-6">
              <p className="text-xs font-bold text-noir-900">Elena S.</p>
              <p className="text-[11px] text-luxury-500">Milan, Italy • Verified Collector</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
