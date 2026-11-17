import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../lib/utils';
import { PAKISTANI_CITIES } from '../lib/pakistaniCities';
import { Button } from '../components/ui/Button';

export const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShippingFee,
    getFreeShippingRemaining,
    getFreeShippingProgress,
    getDiscount,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    isApplyingCoupon,
    selectedCity,
    setSelectedCity,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscount();
  const total = getTotal();
  const remainingForFreeShipping = getFreeShippingRemaining();
  const progressPercent = getFreeShippingProgress();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyCoupon(promoInput.trim());
    if (res.success) setPromoInput('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-ivory-100 flex items-center justify-center border border-charcoal-200">
          <ShoppingBag className="h-7 w-7 text-charcoal-400" />
        </div>
        <h2 className="font-serif text-3xl text-charcoal-900 font-normal">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
          Explore our silk slip dresses, bridal collections, and French Chantilly lace sets.
        </p>
        <Link to="/shop">
          <Button size="lg" className="mt-2">
            Explore Atelier
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-charcoal-200/60 pb-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Review Selection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal">
          Shopping Bag ({items.length} {items.length === 1 ? 'Piece' : 'Pieces'})
        </h1>
      </div>

      {/* Free Shipping Progress */}
      <div className="bg-white p-4 rounded-sm border border-charcoal-200/60 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          {remainingForFreeShipping > 0 ? (
            <span className="text-charcoal-700">
              Add <strong>{formatPrice(remainingForFreeShipping)}</strong> more to your bag to enjoy <strong>Complimentary Nationwide Delivery</strong>.
            </span>
          ) : (
            <span className="text-emerald-800 font-medium flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-gold-vip" />
              <span>Complimentary Nationwide Delivery Unlocked for Your Order!</span>
            </span>
          )}
          <span className="font-semibold text-charcoal-900 text-xs">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-ivory-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-accent to-gold-vip transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items Table / List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item, idx) => (
            <div
              key={`${item.product._id}-${item.variant.size}-${item.variant.color}`}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 p-4 bg-white rounded-sm border border-charcoal-200/60 shadow-sm items-start sm:items-center justify-between"
            >
              <div className="flex space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-20 h-28 object-cover rounded-sm border border-charcoal-200/50 flex-shrink-0"
                />
                <div className="space-y-1">
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="font-serif text-base font-medium text-charcoal-900 hover:text-rose-deep transition-colors line-clamp-1"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-[11px] text-charcoal-500">{item.product.fabric}</p>
                  <div className="text-xs text-charcoal-600 space-x-3 pt-1">
                    <span>Size: <strong>{item.variant.size}</strong></span>
                    <span>·</span>
                    <span>Color: <strong>{item.variant.color}</strong></span>
                  </div>
                  <div className="text-xs font-semibold text-charcoal-900 pt-1">
                    {formatPrice(item.product.price)}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6">
                <div className="flex items-center border border-charcoal-300 rounded-sm bg-ivory-50">
                  <button
                    onClick={() => updateQuantity(idx, item.qty - 1)}
                    className="px-2.5 py-1 text-charcoal-600 hover:text-charcoal-900"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-2.5 text-xs font-semibold text-charcoal-900">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(idx, item.qty + 1)}
                    className="px-2.5 py-1 text-charcoal-600 hover:text-charcoal-900"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-charcoal-900">
                    {formatPrice(item.product.price * item.qty)}
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-[11px] text-charcoal-400 hover:text-red-600 transition-colors mt-0.5 flex items-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider text-charcoal-600 hover:text-charcoal-900 font-semibold"
            >
              ← Continue Browsing Collections
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-sm border border-charcoal-200/70 shadow-soft space-y-6 h-fit">
          <h3 className="font-serif text-xl font-medium text-charcoal-900 border-b border-charcoal-100 pb-3">
            Bag Summary
          </h3>

          {/* City Delivery Selector */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-600 mb-1">
              Destination City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-xs h-10 px-3 border border-charcoal-200 rounded-sm bg-white"
            >
              {PAKISTANI_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Promo code */}
          {!appliedCoupon ? (
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-600">
                Privilege Promo Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. VELOURA10"
                  className="flex-1 text-xs px-3 py-2 border border-charcoal-200 rounded-sm uppercase tracking-wider"
                />
                <Button type="submit" size="sm" variant="outline" isLoading={isApplyingCoupon}>
                  Apply
                </Button>
              </div>
              {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
            </form>
          ) : (
            <div className="p-3 bg-gold-light/40 border border-gold-vip/30 rounded-sm text-xs flex justify-between items-center">
              <div>
                <span className="font-semibold text-gold-dark">{appliedCoupon.code}</span>
                <span className="text-charcoal-600 ml-1">(-{formatPrice(discount)})</span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-[11px] font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          {/* Totals */}
          <div className="space-y-2 text-xs text-charcoal-600 border-t border-charcoal-100 pt-4">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-medium text-charcoal-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Nationwide Delivery ({selectedCity})</span>
              <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(shipping)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-deep font-medium">
                <span>Privilege Discount</span>
                <span>- {formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-charcoal-900 pt-3 border-t border-charcoal-200">
              <span>Total Payable</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/checkout')}
            size="lg"
            className="w-full flex items-center justify-center space-x-2"
          >
            <span>Proceed to Discreet Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="p-3 bg-ivory-100 rounded-sm border border-charcoal-200/50 text-[11px] text-charcoal-600 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-charcoal-900">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-vip" />
              <span>100% Confidential Guarantee</span>
            </div>
            <p>Plain unbranded parcel box. No lingerie descriptions on the courier label.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
