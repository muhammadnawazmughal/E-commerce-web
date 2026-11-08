import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';
import { ROUTES } from '../../constants/routes';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const isLiked = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const formatPrice = (value) => `Rs. ${Math.round(value * 280).toLocaleString('en-PK')}`;
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80';
  const hoverImage = product.images?.[1] || mainImage;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-luxury-200/80 overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300">
      
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-luxury-50">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <Badge variant="rose">
              -{discountPercent}% OFF
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="gold">
              Bestseller
            </Badge>
          )}
          {isOutOfStock ? (
            <Badge variant="danger">
              Sold Out
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning">
              Only {product.stock} Left
            </Badge>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isLiked
              ? 'bg-rose-50 text-rose-deep border border-rose-200'
              : 'bg-white/80 text-luxury-600 hover:text-rose-deep hover:bg-white'
          }`}
          title={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-deep' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto flex gap-2">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              isOutOfStock
                ? 'bg-luxury-300 text-luxury-600 cursor-not-allowed'
                : 'bg-noir-900 hover:bg-gold text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
          </button>
          <Link
            to={`/products/${product._id}`}
            className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-noir-900 border border-luxury-200 shadow-lg flex items-center justify-center transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-luxury-500 font-medium mb-1">
            <span className="uppercase tracking-wider">{product.brand}</span>
            {product.categoryId?.name && (
              <span className="text-[11px] text-luxury-400">{product.categoryId.name}</span>
            )}
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="text-sm font-medium text-noir-900 font-serif line-clamp-1 hover:text-gold transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <StarRating rating={product.rating || 5} size="xs" />
            <span className="text-[11px] text-luxury-500 font-medium">
              ({product.reviewCount || 0})
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-2 border-t border-luxury-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-serif font-bold text-noir-900">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-luxury-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-luxury-500 font-medium">
            {isOutOfStock ? 'Unavailable' : 'In Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
