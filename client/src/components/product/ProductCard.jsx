import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useWishlistStore } from '../../store/useWishlistStore';
import { Badge } from '../ui/Badge';
import { QuickAddModal } from '../common/QuickAddModal';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product._id);

  // Primary and secondary hover image
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  // Check if any variant is low stock (stock > 0 and stock <= 3)
  const isLowStock = product.variants?.some((v) => v.stock > 0 && v.stock <= 3);
  const isOutOfStock = product.totalStock === 0;

  return (
    <>
      <div
        className="group relative flex flex-col bg-transparent select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-ivory-100 border border-charcoal-200/40">
          <Link to={`/product/${product.slug}`} className="block h-full w-full">
            <img
              src={isHovered ? secondaryImage : primaryImage}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03]"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
            {product.tags?.includes('New Arrival') && (
              <Badge variant="default" className="text-[9px] px-2 py-0.5">
                New
              </Badge>
            )}
            {product.tags?.includes('VIP Exclusive') && (
              <Badge variant="gold" className="text-[9px] px-2 py-0.5 flex items-center space-x-1">
                <Sparkles className="h-2.5 w-2.5" />
                <span>Privé VIP</span>
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="rose" className="text-[9px] px-2 py-0.5">
                Few Left
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="alert" className="text-[9px] px-2 py-0.5">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label="Add to wishlist"
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-sm text-charcoal-700 hover:text-rose-deep hover:bg-white transition-all shadow-sm z-10 active:scale-90"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorited ? 'fill-rose-deep text-rose-deep' : ''
              }`}
            />
          </button>

          {/* Quick Add Button on Hover (Desktop) */}
          <div className="absolute bottom-3 inset-x-3 transition-all duration-300 transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block z-10">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              disabled={isOutOfStock}
              className="w-full bg-white/95 backdrop-blur-md text-charcoal-900 hover:bg-charcoal-900 hover:text-ivory-50 border border-charcoal-900/30 text-[11px] font-medium uppercase tracking-widest py-2.5 px-4 rounded-sm transition-all shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pt-3 pb-1 flex flex-col space-y-1">
          {/* Fabric label */}
          <span className="text-[10px] uppercase tracking-widest text-charcoal-400 line-clamp-1 font-medium">
            {product.fabric || 'Fine Silk & Lace'}
          </span>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-serif text-base text-charcoal-900 hover:text-rose-deep transition-colors line-clamp-1 font-normal"
          >
            {product.title}
          </Link>

          {/* Price */}
          <div className="flex items-center space-x-2 pt-0.5">
            <span className="text-xs font-semibold text-charcoal-900 tracking-wide">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-charcoal-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Available color swatches preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center space-x-1 pt-1">
              {Array.from(new Set(product.variants.map((v) => v.colorHex || '#1C1A19')))
                .slice(0, 4)
                .map((hex, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2.5 rounded-full border border-black/15"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              {new Set(product.variants.map((v) => v.color)).size > 4 && (
                <span className="text-[9px] text-charcoal-400 font-sans">
                  +{new Set(product.variants.map((v) => v.color)).size - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        product={product}
      />
    </>
  );
};
