import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../lib/utils';
import { PAKISTANI_CITIES } from '../lib/pakistaniCities';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getShippingFee, getDiscount, getTotal, appliedCoupon, clearCart } =
    useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscount();
  const total = getTotal();

  // Form states
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Karachi');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [discreetAgreed, setDiscreetAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Populate from user default address if exists
  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setRecipientName(defaultAddr.recipientName || user.name);
      setPhone(defaultAddr.phone || user.phone);
      setStreetAddress(defaultAddr.streetAddress || '');
      setApartment(defaultAddr.apartment || '');
      setCity(defaultAddr.city || 'Karachi');
      setPostalCode(defaultAddr.postalCode || '');
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!recipientName.trim() || !phone.trim() || !streetAddress.trim() || !city) {
      setErrorMessage('Please provide complete delivery recipient details.');
      return;
    }

    // Phone validation for Pakistan (03XX or +923XX)
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^((\+92)|(0092)|(92)|(0))?3[0-9]{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid Pakistani mobile number (e.g., 0300 1234567).');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        items: items.map((item) => ({
          product: item.product._id,
          title: item.product.title,
          image: item.product.image,
          variant: item.variant,
          price: item.product.price,
          qty: item.qty,
        })),
        shippingAddress: {
          recipientName,
          phone,
          streetAddress,
          apartment,
          city,
          postalCode,
          discreetPackagingRequested: discreetAgreed,
          deliveryNotes,
          email,
        },
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        guestInfo: !isAuthenticated
          ? {
              name: recipientName,
              email: email || `${cleanPhone}@guest.veloura.pk`,
              phone,
            }
          : undefined,
      };

      const res = await api.post('/orders', orderPayload);

      if (res?.order) {
        clearCart();
        navigate(`/order-confirmation/${res.order.orderNumber}`, {
          state: { order: res.order },
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Checkout Header */}
      <div className="border-b border-charcoal-200/60 pb-6 mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
            Confidential Atelier Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal">
            Finalize Your Order
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs text-charcoal-600 bg-white px-3.5 py-1.5 rounded-sm border border-charcoal-200 shadow-sm">
          <Lock className="h-3.5 w-3.5 text-gold-vip" />
          <span>256-Bit Encrypted & Discretion Guaranteed</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Info */}
            <div className="bg-white p-6 rounded-sm border border-charcoal-200/70 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
                <h3 className="font-serif text-lg font-medium text-charcoal-900">
                  1. Recipient & Contact Details
                </h3>
                {!isAuthenticated && (
                  <Link to="/login" className="text-xs text-rose-deep hover:underline">
                    Already have an account? Sign In
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name *"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient's Name"
                  />
                </div>

                <div>
                  <Input
                    label="Mobile Phone (+92) *"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                  />
                  <span className="text-[10px] text-charcoal-400 mt-1 block">
                    Used for courier delivery confirmation.
                  </span>
                </div>

                <div>
                  <Input
                    label="Email Address (for order tracking receipt) *"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                  />
                </div>
              </div>
            </div>

            {/* 2. Pakistani Delivery Address */}
            <div className="bg-white p-6 rounded-sm border border-charcoal-200/70 shadow-soft space-y-4">
              <h3 className="font-serif text-lg font-medium text-charcoal-900 border-b border-charcoal-100 pb-3">
                2. Shipping Destination (Pakistan)
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-charcoal-200 rounded-sm text-sm focus:outline-none focus:border-charcoal-900"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Input
                      label="Postal Code (Optional)"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 75600"
                    />
                  </div>
                </div>

                <Input
                  label="Street Address / House / Flat No. *"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. House 14-B, Street 7, Block 4, Clifton"
                />

                <Input
                  label="Apartment, Suite, Landmark (Optional)"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="e.g. Sea View Manor, Near Bilawal Chowrangi"
                />

                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                    Special Confidential Delivery Instructions (Optional)
                  </label>
                  <textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows="2"
                    placeholder="e.g. Please call before arriving; leave with building reception..."
                    className="w-full text-xs p-3 border border-charcoal-200 rounded-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-white p-6 rounded-sm border border-charcoal-200/70 shadow-soft space-y-4">
              <h3 className="font-serif text-lg font-medium text-charcoal-900 border-b border-charcoal-100 pb-3">
                3. Payment Method
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start space-x-3 p-4 rounded-sm border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-charcoal-900 bg-ivory-100/60 shadow-sm'
                      : 'border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 text-charcoal-900 focus:ring-charcoal-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Banknote className="h-4 w-4 text-emerald-700" />
                      <strong className="text-xs uppercase tracking-wider text-charcoal-900">
                        Cash on Delivery (COD) — Recommended
                      </strong>
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Pay cash to the courier upon receiving your sealed, unbranded parcel. Standard for all Pakistani cities.
                    </p>
                  </div>
                </label>

                {/* JazzCash */}
                <label
                  className={`flex items-start space-x-3 p-4 rounded-sm border cursor-pointer transition-all ${
                    paymentMethod === 'JazzCash'
                      ? 'border-charcoal-900 bg-ivory-100/60 shadow-sm'
                      : 'border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="JazzCash"
                    checked={paymentMethod === 'JazzCash'}
                    onChange={() => setPaymentMethod('JazzCash')}
                    className="mt-1 text-charcoal-900 focus:ring-charcoal-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-red-600" />
                      <strong className="text-xs uppercase tracking-wider text-charcoal-900">
                        JazzCash Wallet / Mobile Account
                      </strong>
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Instantly transfer to VELOURA Privé Merchant Till (Account: 0300 1234567). Concierge will confirm receipt.
                    </p>
                  </div>
                </label>

                {/* Easypaisa */}
                <label
                  className={`flex items-start space-x-3 p-4 rounded-sm border cursor-pointer transition-all ${
                    paymentMethod === 'Easypaisa'
                      ? 'border-charcoal-900 bg-ivory-100/60 shadow-sm'
                      : 'border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Easypaisa"
                    checked={paymentMethod === 'Easypaisa'}
                    onChange={() => setPaymentMethod('Easypaisa')}
                    className="mt-1 text-charcoal-900 focus:ring-charcoal-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-emerald-600" />
                      <strong className="text-xs uppercase tracking-wider text-charcoal-900">
                        Easypaisa Mobile Wallet
                      </strong>
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Direct mobile transfer to our official atelier account (0321 4455667).
                    </p>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label
                  className={`flex items-start space-x-3 p-4 rounded-sm border cursor-pointer transition-all ${
                    paymentMethod === 'Bank Transfer'
                      ? 'border-charcoal-900 bg-ivory-100/60 shadow-sm'
                      : 'border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Bank Transfer"
                    checked={paymentMethod === 'Bank Transfer'}
                    onChange={() => setPaymentMethod('Bank Transfer')}
                    className="mt-1 text-charcoal-900 focus:ring-charcoal-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-charcoal-700" />
                      <strong className="text-xs uppercase tracking-wider text-charcoal-900">
                        Direct Bank Wire (Meezan Bank / HBL)
                      </strong>
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Meezan Bank Limited — Account Title: VELOURA PRIVE (PK64MEZN00010203040506). Send screenshot on WhatsApp.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* 4. Discretion Checkbox */}
            <div className="p-4 bg-ivory-100 border border-charcoal-200/80 rounded-sm flex items-start space-x-3">
              <input
                type="checkbox"
                id="discreet"
                checked={discreetAgreed}
                onChange={(e) => setDiscreetAgreed(e.target.checked)}
                className="mt-1 text-charcoal-900 focus:ring-charcoal-900 rounded"
              />
              <label htmlFor="discreet" className="text-xs text-charcoal-700 cursor-pointer">
                <strong className="text-charcoal-900">100% Discreet Packaging Guarantee:</strong>{' '}
                I understand that my order will be delivered in completely opaque, unbranded outer courier packaging with zero product names or brand logos on the shipping air waybill.
              </label>
            </div>
          </div>

          {/* Right Sidebar: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-sm border border-charcoal-200/70 shadow-soft space-y-5 sticky top-28">
              <h3 className="font-serif text-xl font-medium text-charcoal-900 border-b border-charcoal-100 pb-3">
                Order Review ({items.length} {items.length === 1 ? 'Item' : 'Items'})
              </h3>

              {/* Items scroll */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product._id}-${item.variant.size}-${item.variant.color}`}
                    className="flex space-x-3 text-xs"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-14 h-18 object-cover rounded-sm border border-charcoal-200/50 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-charcoal-900 line-clamp-1">{item.product.title}</h4>
                      <p className="text-[11px] text-charcoal-500">
                        {item.variant.size} · {item.variant.color} · Qty: {item.qty}
                      </p>
                      <span className="font-semibold text-charcoal-900">
                        {formatPrice(item.product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost breakdown */}
              <div className="space-y-2 text-xs text-charcoal-600 border-t border-charcoal-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nationwide Express Delivery ({city})</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-700">COMPLIMENTARY</strong> : formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-rose-deep font-medium">
                    <span>Privilege Code ({appliedCoupon?.code})</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-serif font-bold text-charcoal-900 pt-3 border-t border-charcoal-200">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full text-xs font-semibold py-4"
              >
                Place Confidential Order ({formatPrice(total)})
              </Button>

              <div className="text-center space-y-1 text-[11px] text-charcoal-500 pt-1">
                <p>🔒 100% Privacy & Discreet Shipping Guaranteed.</p>
                <p>Telephone order confirmation will be conducted confidentially.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
