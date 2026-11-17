import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShieldCheck, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/utils';
import { PAKISTANI_CITIES } from '../../lib/pakistaniCities';
import { Button } from '../ui/Button';

export const CartDrawer = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
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
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleProceedCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-ivory-50 shadow-2xl flex flex-col border-l border-charcoal-200/60"
            >
              {/* Header */}
              <div className="p-5 border-b border-charcoal-200/60 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-serif text-xl font-medium text-charcoal-900 tracking-wide">
                    Your Shopping Bag
                  </h3>
                  <span className="text-[11px] text-charcoal-500 uppercase tracking-wider">
                    {items.length} {items.length === 1 ? 'Piece' : 'Pieces'} Selected
                  </span>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 text-charcoal-400 hover:text-charcoal-900 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="bg-ivory-200 px-5 py-3 border-b border-charcoal-200/50">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  {remainingForFreeShipping > 0 ? (
                    <span className="text-charcoal-700">
                      Add <strong className="text-charcoal-900">{formatPrice(remainingForFreeShipping)}</strong> more for <strong>Complimentary Shipping</strong>
                    </span>
                  ) : (
                    <span className="text-emerald-800 font-medium flex items-center space-x-1">
                      <Sparkles className="h-3.5 w-3.5 text-gold-vip" />
                      <span>Complimentary Nationwide Shipping Unlocked!</span>
                    </span>
                  )}
                  <span className="font-semibold text-[11px] text-charcoal-700">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-charcoal-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-accent to-gold-vip transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <p className="font-serif text-2xl text-charcoal-500 italic">Your bag is empty.</p>
                    <p className="text-xs text-charcoal-400 max-w-xs mx-auto">
                      Explore our silk slips, handcrafted lace bras, and bridal collections.
                    </p>
                    <Button
                      onClick={() => {
                        closeDrawer();
                        navigate('/shop');
                      }}
                      size="sm"
                      className="mt-2"
                    >
                      Explore Atelier
                    </Button>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={`${item.product._id}-${item.variant.size}-${item.variant.color}`}
                      className="flex space-x-4 p-3 bg-white rounded-sm border border-charcoal-200/50 shadow-sm"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-18 h-24 w-20 object-cover rounded-sm border border-charcoal-200/40"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-sm font-medium text-charcoal-900 line-clamp-1 pr-2">
                              {item.product.title}
                            </h4>
                            <button
                              onClick={() => removeItem(idx)}
                              className="text-charcoal-400 hover:text-red-600 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-charcoal-500 mt-0.5 space-x-2">
                            <span>Size: <strong>{item.variant.size}</strong></span>
                            <span>·</span>
                            <span>Color: <strong>{item.variant.color}</strong></span>
                          </div>
                          <div className="text-xs font-semibold text-charcoal-900 mt-1">
                            {formatPrice(item.product.price)}
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center border border-charcoal-200 rounded-sm">
                            <button
                              onClick={() => updateQuantity(idx, item.qty - 1)}
                              className="px-2 py-1 text-charcoal-600 hover:text-charcoal-900 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-medium text-charcoal-900">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(idx, item.qty + 1)}
                              className="px-2 py-1 text-charcoal-600 hover:text-charcoal-900 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-[11px] text-charcoal-400">
                            Total: {formatPrice(item.product.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Checkout Summary */}
              {items.length > 0 && (
                <div className="p-5 border-t border-charcoal-200/60 bg-white space-y-4">
                  {/* City delivery estimate selector */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal-600">Estimate delivery to:</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="text-xs font-medium border border-charcoal-200 rounded-sm py-1 px-2 bg-ivory-50 focus:outline-none"
                    >
                      {PAKISTANI_CITIES.slice(0, 15).map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Promo Code Input */}
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                      <div className="relative flex-1">
                        <Tag className="h-3.5 w-3.5 text-charcoal-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Privilege Code (e.g. VELOURA10)"
                          className="w-full text-xs py-2 pl-8 pr-3 border border-charcoal-200 rounded-sm uppercase tracking-wider focus:outline-none focus:border-charcoal-900"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        isLoading={isApplyingCoupon}
                      >
                        Apply
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-gold-light/40 border border-gold-vip/30 p-2 rounded-sm text-xs">
                      <div className="flex items-center space-x-2 text-gold-dark font-medium">
                        <Tag className="h-3.5 w-3.5 text-gold-vip" />
                        <span>Code <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discount)})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-charcoal-400 hover:text-red-600 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-red-600">{couponError}</p>
                  )}

                  {/* Breakdown */}
                  <div className="space-y-1.5 text-xs text-charcoal-600 border-t border-charcoal-100 pt-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery ({selectedCity})</span>
                      <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-rose-deep font-medium">
                        <span>Privilege Discount</span>
                        <span>- {formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-charcoal-900 pt-2 border-t border-charcoal-200">
                      <span>Estimated Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleProceedCheckout}
                      className="w-full flex items-center justify-center space-x-2"
                      size="lg"
                    >
                      <span>Proceed to Discreet Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center justify-center space-x-1.5 text-[11px] text-charcoal-500 pt-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-gold-vip" />
                      <span>Discreet unbranded packaging · Cash on Delivery</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
