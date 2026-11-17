import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Star,
  Check,
  AlertCircle,
  HelpCircle,
  Share2,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import api from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AccordionItem } from '../components/ui/Accordion';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewFit, setReviewFit] = useState('True to Size');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/products/${slug}`);
        if (data?.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);

          // Set default color & size
          if (data.product.variants?.length > 0) {
            setSelectedColor(data.product.variants[0].color);
            setSelectedSize(data.product.variants[0].size);
          }

          // Fetch reviews
          const reviewsData = await api.get(`/reviews/product/${data.product._id}`);
          if (reviewsData?.reviews) {
            setReviews(reviewsData.reviews);
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl">Piece Not Found</h2>
        <p className="text-xs text-charcoal-500">The requested design may have retired from the collection.</p>
        <Link to="/shop">
          <Button>Return to Atelier</Button>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const variantsForColor = product.variants.filter((v) => v.color === selectedColor);
  const activeVariant = variantsForColor.find((v) => v.size === selectedSize) || variantsForColor[0];

  const isOutOfStock = !activeVariant || activeVariant.stock <= 0;
  const isLowStock = activeVariant && activeVariant.stock > 0 && activeVariant.stock <= 3;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, activeVariant, qty);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    try {
      setIsSubmittingReview(true);
      const res = await api.post(`/reviews/product/${product._id}`, {
        rating: reviewRating,
        comment: reviewComment,
        authorName: reviewAuthor || user?.name || 'Verified Client',
        fitFeedback: reviewFit,
      });

      if (res?.review) {
        setReviews([res.review, ...reviews]);
        setReviewComment('');
        setReviewSuccessMsg('Thank you. Your review has been published.');
        setTimeout(() => setReviewSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-400">
        <Link to="/" className="hover:text-charcoal-900 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-charcoal-900 transition-colors">Atelier</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-charcoal-900 transition-colors">
          {product.category?.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal-900 font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery (Thumbnails + Main Image with Zoom) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails strip */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible flex-shrink-0">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedImageIndex === idx ? 'border-charcoal-900 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.alt || product.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Selected Image */}
          <div className="relative flex-1 aspect-[3/4] rounded-sm overflow-hidden bg-ivory-100 border border-charcoal-200/50 shadow-soft group">
            <img
              src={product.images?.[selectedImageIndex]?.url || product.images?.[0]?.url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {product.tags?.includes('VIP Exclusive') && (
              <div className="absolute top-4 left-4">
                <Badge variant="gold" className="text-[10px] px-3 py-1 flex items-center space-x-1.5 shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  <span>VIP Atelier Exclusive</span>
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-charcoal-200/60 pb-5">
            <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
              {product.fabric}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal leading-tight">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="text-xs text-charcoal-500 font-normal">{product.subtitle}</p>
            )}

            {/* Price & Reviews */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline space-x-3">
                <span className="font-serif text-2xl font-semibold text-charcoal-900">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-charcoal-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center space-x-1.5 text-xs text-charcoal-600">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.round(product.ratings) ? 'fill-amber-400 text-amber-400' : 'text-charcoal-200'}`}
                    />
                  ))}
                </div>
                <span className="font-medium text-charcoal-900">{product.ratings.toFixed(1)}</span>
                <span className="text-charcoal-400">({product.numReviews})</span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-700">
                Color: <strong className="text-charcoal-900">{selectedColor}</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => {
                const sample = product.variants.find((v) => v.color === c);
                const isSelected = selectedColor === c;
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      const firstSz = product.variants.find((v) => v.color === c)?.size;
                      if (firstSz) setSelectedSize(firstSz);
                    }}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-sm border text-xs transition-all ${
                      isSelected
                        ? 'border-charcoal-900 bg-charcoal-900 text-ivory-50 font-medium'
                        : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-charcoal-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: sample?.colorHex || '#1C1A19' }}
                    />
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-700">
                Select Size:
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-rose-deep hover:underline flex items-center space-x-1 font-medium"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Size Guide & Calculator</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {variantsForColor.map((v) => {
                const isSelected = selectedSize === v.size;
                const isVariantOut = v.stock <= 0;

                return (
                  <button
                    key={v.size}
                    disabled={isVariantOut}
                    onClick={() => setSelectedSize(v.size)}
                    className={`py-2.5 text-xs font-medium rounded-sm border transition-all text-center relative ${
                      isSelected
                        ? 'border-charcoal-900 bg-charcoal-900 text-ivory-50 shadow-sm'
                        : isVariantOut
                        ? 'border-charcoal-200 bg-charcoal-100/60 text-charcoal-300 line-through cursor-not-allowed'
                        : 'border-charcoal-200 bg-white text-charcoal-800 hover:border-charcoal-900'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>

            {/* Low stock notice */}
            {isLowStock && (
              <div className="flex items-center space-x-2 text-xs text-rose-deep bg-rose-light/80 p-2.5 rounded-sm border border-rose-accent/20">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Atelier Alert: Only {activeVariant.stock} pieces remaining in {activeVariant.size}.</span>
              </div>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex space-x-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-charcoal-300 rounded-sm bg-white">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3.5 py-3 text-charcoal-600 hover:text-charcoal-900"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-2 text-xs font-semibold text-charcoal-900">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3.5 py-3 text-charcoal-600 hover:text-charcoal-900"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="flex-1 text-xs"
              >
                {isOutOfStock ? 'Currently Unavailable' : 'Add to Shopping Bag'}
              </Button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Add to wishlist"
                className="h-14 w-14 rounded-sm border border-charcoal-300 flex items-center justify-center text-charcoal-700 hover:text-rose-deep hover:border-rose-accent bg-white transition-colors"
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-rose-deep text-rose-deep' : ''}`} />
              </button>
            </div>

            {/* Share / Confidential Concierge buttons */}
            <div className="flex items-center justify-between pt-1 text-xs text-charcoal-500">
              <button onClick={handleShare} className="flex items-center space-x-1.5 hover:text-charcoal-900">
                <Share2 className="h-3.5 w-3.5" />
                <span>{shareCopied ? 'Link Copied to Clipboard!' : 'Share Piece'}</span>
              </button>

              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-emerald-700 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>Confidential Fit Advice</span>
              </a>
            </div>
          </div>

          {/* Discreet Packaging Guarantee Notice */}
          <div className="p-4 bg-white border border-charcoal-200/70 rounded-sm space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-gold-vip" />
              <span>100% Confidential Delivery Guarantee</span>
            </div>
            <p className="text-[11px] text-charcoal-500 leading-relaxed font-normal">
              Your parcel will arrive in completely unbranded, opaque outer packaging with zero mentions of lingerie or undergarments on the shipping label. Complete discretion guaranteed.
            </p>
          </div>

          {/* Accordion Tabs */}
          <div className="border-t border-charcoal-200/60 pt-4">
            <AccordionItem title="Editorial Description" defaultOpen={true}>
              <p className="leading-relaxed text-charcoal-700">{product.description}</p>
              {product.details?.length > 0 && (
                <div className="mt-3 space-y-1.5 pt-2 border-t border-charcoal-100">
                  {product.details.map((d, i) => (
                    <div key={i} className="text-xs">
                      <strong className="text-charcoal-900">{d.title}:</strong>{' '}
                      <span className="text-charcoal-600">{d.content}</span>
                    </div>
                  ))}
                </div>
              )}
            </AccordionItem>

            <AccordionItem title="Fabric Composition & Care Instructions">
              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-charcoal-900">Composition:</strong> {product.fabric}
                </div>
                <div>
                  <strong className="text-charcoal-900">Care:</strong> {product.careInstructions}
                </div>
              </div>
            </AccordionItem>

            <AccordionItem title="Shipping, COD & 7-Day Fit Exchange">
              <div className="space-y-2 text-xs text-charcoal-600">
                <p>• <strong>Karachi & Lahore:</strong> 24 to 48 business hours via TCS Express.</p>
                <p>• <strong>Islamabad & Nationwide:</strong> 2 to 4 business days.</p>
                <p>• <strong>Payment:</strong> Cash on Delivery, JazzCash, Easypaisa, or Direct Bank Transfer.</p>
                <p>• <strong>Size Exchange:</strong> 7-day hassle-free exchange policy for unworn items with tags intact.</p>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-charcoal-200/70 pt-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
              Client Experiences
            </span>
            <h3 className="font-serif text-3xl text-charcoal-900 font-normal">
              Verified Client Reviews ({reviews.length})
            </h3>
          </div>

          <div className="flex items-center space-x-3 bg-white p-3 rounded-sm border border-charcoal-200/60">
            <span className="font-serif text-3xl font-bold text-charcoal-900">
              {product.ratings.toFixed(1)}
            </span>
            <div className="text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(product.ratings) ? 'fill-amber-400 text-amber-400' : 'text-charcoal-200'}`}
                  />
                ))}
              </div>
              <span className="text-charcoal-500 font-medium">Overall Client Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-charcoal-500 italic py-6">
                Be the first to share your fitting experience for this atelier piece.
              </p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 bg-white rounded-sm border border-charcoal-200/50 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-charcoal-900">{rev.authorName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="ml-2 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm font-medium">
                          Verified Client
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-charcoal-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <span className="inline-block text-[10px] uppercase tracking-wider text-charcoal-500 font-medium bg-ivory-100 px-2 py-0.5 rounded">
                    Fit: {rev.fitFeedback || 'True to Size'}
                  </span>

                  <p className="text-xs text-charcoal-700 leading-relaxed font-normal pt-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Submit Review Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-charcoal-200/60 shadow-soft space-y-4">
            <h4 className="font-serif text-xl font-medium text-charcoal-900">
              Share Your Atelier Experience
            </h4>
            <p className="text-xs text-charcoal-500 font-light leading-relaxed">
              Your confidential feedback guides our female design atelier in perfecting comfort and sizing.
            </p>

            {reviewSuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-sm border border-emerald-200">
                {reviewSuccessMsg}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 font-medium mb-1">
                  Overall Rating
                </label>
                <div className="flex space-x-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-charcoal-200'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 font-medium mb-1">
                  Fit Feedback
                </label>
                <select
                  value={reviewFit}
                  onChange={(e) => setReviewFit(e.target.value)}
                  className="w-full text-xs h-10 px-3 border border-charcoal-200 rounded-sm bg-white"
                >
                  <option value="True to Size">True to Size</option>
                  <option value="Runs Small">Runs Small (Recommend sizing up)</option>
                  <option value="Runs Large">Runs Large (Recommend sizing down)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 font-medium mb-1">
                  Your Name (or Confidential Initial)
                </label>
                <input
                  type="text"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Sara F. (Lahore)"
                  className="w-full text-xs h-10 px-3 border border-charcoal-200 rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 font-medium mb-1">
                  Comments on Comfort, Fabric & Discretion
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows="3"
                  placeholder="Describe the fabric softness, support, packaging..."
                  required
                  className="w-full text-xs p-3 border border-charcoal-200 rounded-sm bg-white"
                />
              </div>

              <Button
                type="submit"
                size="default"
                isLoading={isSubmittingReview}
                className="w-full"
              >
                Submit Review
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Complete the Set / Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-charcoal-200/70 pt-16 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
              Harmonious Complements
            </span>
            <h3 className="font-serif text-3xl text-charcoal-900 font-normal">
              Complete The Set
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
