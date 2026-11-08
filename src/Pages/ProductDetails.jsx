import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  CheckCircle2,
  Shield,
  Truck,
  Sparkles,
  ArrowLeft,
  MessageSquarePlus,
  Plus,
  Minus
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/common/StarRating';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES } from '../constants/routes';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        setProduct(res.data.product);
        setReviews(res.data.reviews || []);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Retrieving haute botanical formula..." fullScreen />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-noir-900">Formula Not Found</h2>
        <p className="text-luxury-600">The product you are seeking may be retired or unavailable.</p>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-noir-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Collection</span>
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'];

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Please enter your review feedback.', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await productService.addReview(product._id, {
        rating: newRating,
        comment: newComment.trim()
      });
      showToast('Thank you! Your verified review has been published.', 'success');
      setReviews([res.data, ...reviews]);
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      showToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-luxury-500 font-medium">
        <Link to={ROUTES.HOME} className="hover:text-gold transition-colors">Home</Link>
        <span>/</span>
        <Link to={ROUTES.PRODUCTS} className="hover:text-gold transition-colors">Collection</Link>
        <span>/</span>
        {product.categoryId && (
          <>
            <Link
              to={`${ROUTES.PRODUCTS}?category=${product.categoryId.slug}`}
              className="hover:text-gold transition-colors"
            >
              {product.categoryId.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-noir-900 truncate font-semibold">{product.name}</span>
      </nav>

      {/* Product Hero Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-luxury-200 shadow-luxury">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {hasDiscount && (
              <Badge variant="rose" className="absolute top-4 left-4">
                Special Edition
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-gold shadow-md scale-105'
                      : 'border-luxury-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Attributes & Buy Box */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
              {product.brand}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-noir-900 mt-1">
              {product.name}
            </h1>

            {/* Rating and Reviews Counter */}
            <div className="flex items-center gap-3 mt-3">
              <StarRating rating={product.rating || 5} size="sm" />
              <span className="text-xs font-semibold text-noir-900">
                {product.rating} / 5.0
              </span>
              <span className="text-luxury-300">•</span>
              <a href="#reviews" className="text-xs text-luxury-600 hover:text-gold underline font-medium">
                {reviews.length} Verified Collector Reviews
              </a>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-white border border-luxury-200/80 shadow-sm flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-noir-900">
                ${currentPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-base text-luxury-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <div>
              {isOutOfStock ? (
                <Badge variant="danger">Temporarily Sold Out</Badge>
              ) : product.stock <= 10 ? (
                <Badge variant="warning">Only {product.stock} Bottles Remaining</Badge>
              ) : (
                <Badge variant="success">In Stock & Ready for Dispatch</Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-luxury-700 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & CTA */}
          <div className="space-y-4 pt-4 border-t border-luxury-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-luxury-300 rounded-2xl bg-white px-3 py-2">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-luxury-600 hover:text-noir-900 disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-noir-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1 text-luxury-600 hover:text-noir-900 disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className={`flex-1 py-4 px-8 rounded-full font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-md ${
                  isOutOfStock
                    ? 'bg-luxury-300 text-luxury-600 cursor-not-allowed'
                    : 'bg-noir-900 hover:bg-gold text-white hover:text-noir-900 shadow-glow'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : 'Acquire Formula'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-full border transition-all ${
                  isLiked
                    ? 'bg-rose-50 border-rose-300 text-rose-deep'
                    : 'border-luxury-300 hover:border-gold text-noir-900 hover:text-gold bg-white'
                }`}
                title={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-deep' : ''}`} />
              </button>
            </div>

            {/* Reassurance Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-luxury-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold" />
                <span>Complimentary luxury shipping & samples</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                <span>100% Authentic Haute formulation</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section: Ingredients, Ritual, Guarantee */}
      <div className="pt-8 border-t border-luxury-200">
        <div className="flex border-b border-luxury-200 gap-8">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-all ${
              activeTab === 'ingredients'
                ? 'border-b-2 border-gold text-noir-900'
                : 'text-luxury-500 hover:text-noir-900'
            }`}
          >
            Cellular Ingredients
          </button>
          <button
            onClick={() => setActiveTab('ritual')}
            className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-all ${
              activeTab === 'ritual'
                ? 'border-b-2 border-gold text-noir-900'
                : 'text-luxury-500 hover:text-noir-900'
            }`}
          >
            Ritual of Application
          </button>
        </div>

        <div className="py-8">
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h4 className="font-serif text-xl font-bold text-noir-900">
                Key Actives & Complete INCI
              </h4>
              <p className="text-sm text-luxury-600 max-w-2xl leading-relaxed">
                Formulated with medical-grade biomimetic complexes, antioxidants, and certified organic plant waters:
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.ingredients?.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-luxury-300 text-xs font-medium text-noir-800 shadow-sm"
                  >
                    ✨ {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ritual' && (
            <div className="space-y-3 max-w-2xl text-sm text-luxury-700 leading-relaxed">
              <h4 className="font-serif text-xl font-bold text-noir-900">
                Recommended Daily Application
              </h4>
              <p>
                1. Cleanse thoroughly with lukewarm water.
              </p>
              <p>
                2. Warm 3-4 drops between clean palms to activate the bio-lipid compounds.
              </p>
              <p>
                3. Press gently into face, neck, and décolletage using uplifting sweep motions until completely absorbed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="pt-8 border-t border-luxury-200 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Collector Experiences
            </span>
            <h2 className="font-serif text-3xl font-bold text-noir-900 mt-1">
              Verified Client Reviews ({reviews.length})
            </h2>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="p-6 rounded-2xl bg-white border border-luxury-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-noir-900">
            <MessageSquarePlus className="w-5 h-5 text-gold" />
            <span>Share Your Experience</span>
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-luxury-700">Your Rating:</span>
                <StarRating
                  rating={newRating}
                  size="md"
                  interactive
                  onRatingChange={(val) => setNewRating(val)}
                />
              </div>

              <div>
                <textarea
                  rows="3"
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Describe texture, fragrance, sensory feel, and visible skin transformation..."
                  className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl p-3.5 text-xs text-noir-900 focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-2.5 rounded-full bg-noir-900 hover:bg-gold text-white text-xs font-semibold uppercase tracking-widest transition-colors shadow-sm"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div className="text-sm text-luxury-600 flex items-center gap-2">
              <span>Please</span>
              <Link to={ROUTES.LOGIN} className="font-semibold text-gold-dark hover:underline">
                sign in
              </Link>
              <span>to leave a verified product review.</span>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-luxury-500 italic">No reviews yet. Be the first to share your thoughts!</p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-6 rounded-2xl bg-white border border-luxury-200/80 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-noir-900">{rev.userName}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      Verified Purchase
                    </span>
                  </div>
                  <span className="text-[11px] text-luxury-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StarRating rating={rev.rating} size="xs" />
                <p className="text-xs sm:text-sm text-luxury-700 leading-relaxed pt-1">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>

      </section>

    </div>
  );
};

export default ProductDetails;
