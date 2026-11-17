import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  ShieldCheck,
  Truck,
  MessageCircle,
  Copy,
  Clock,
  Package,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Burst luxury gold and rose confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C9A961', '#B76E79', '#1C1A19', '#F7F2EE'],
    });

    if (!order && orderNumber) {
      api
        .get(`/orders/${orderNumber}`)
        .then((res) => {
          if (res?.order) setOrder(res.order);
        })
        .catch((err) => console.error(err));
    }
  }, [order, orderNumber]);

  const handleCopyOrderNumber = () => {
    if (order?.orderNumber && navigator.clipboard) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello VELOURA Privé Atelier, I have just placed order ${order?.orderNumber || orderNumber}. Please share tracking details when available.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      {/* Top success card */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-10 w-10" />
        </div>
        <span className="block text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Order Confirmed · Confidential Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal">
          Thank You For Choosing VELOURA Privé
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto leading-relaxed">
          Your order has been safely placed with our atelier. A confirmation receipt has been dispatched to your email.
        </p>

        {/* Order number box */}
        <div className="inline-flex items-center space-x-3 bg-white px-5 py-2.5 rounded-sm border border-charcoal-200 shadow-soft">
          <span className="text-xs text-charcoal-500 uppercase tracking-wider">Order Reference:</span>
          <strong className="font-serif text-lg font-bold text-charcoal-900 tracking-wider">
            {order?.orderNumber || orderNumber}
          </strong>
          <button
            onClick={handleCopyOrderNumber}
            className="text-charcoal-400 hover:text-charcoal-900 transition-colors"
            title="Copy order reference"
          >
            <Copy className="h-4 w-4" />
          </button>
          {copied && <span className="text-[10px] text-emerald-700 font-medium">Copied!</span>}
        </div>
      </div>

      {/* Discreet Packaging Guarantee Alert Box */}
      <div className="bg-ivory-100 border border-gold-vip/40 p-6 rounded-sm shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-sm border border-gold-vip/30">
            <ShieldCheck className="h-6 w-6 text-gold-vip" />
          </div>
          <div>
            <h4 className="font-serif text-base font-semibold text-charcoal-900">
              100% Confidential Delivery Guarantee
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed max-w-xl">
              Your parcel will arrive enclosed inside a completely plain, unbranded opaque courier bag. The shipping manifest contains only your name and courier tracking ID — zero lingerie or brand names will appear.
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Timeline & Delivery Details */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/70 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-charcoal-100 pb-4 gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-400">Order Status</span>
              <div className="font-serif text-xl font-medium text-charcoal-900 flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>{order.orderStatus} (Awaiting Telephone Confirmation)</span>
              </div>
            </div>

            <div className="text-right text-xs text-charcoal-500">
              <span>Payment: <strong>{order.paymentMethod}</strong></span>
              <div>Total: <strong className="text-charcoal-900">{formatPrice(order.total)}</strong></div>
            </div>
          </div>

          {/* Delivery Recipient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal-700">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400 block mb-1">
                Recipient Details
              </span>
              <p className="font-medium text-charcoal-900">{order.shippingAddress.recipientName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.guestInfo?.email || order.shippingAddress.email}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400 block mb-1">
                Shipping Destination
              </span>
              <p>{order.shippingAddress.streetAddress}</p>
              {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
              <p>{order.shippingAddress.city}, Pakistan</p>
            </div>
          </div>

          {/* Ordered items preview */}
          <div className="border-t border-charcoal-100 pt-4 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400 block">
              Items in this Package
            </span>
            <div className="divide-y divide-charcoal-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded-sm border border-charcoal-200"
                    />
                    <div>
                      <p className="font-medium text-charcoal-900">{item.title}</p>
                      <p className="text-[11px] text-charcoal-500">
                        {item.variant.size} · {item.variant.color} · Qty: {item.qty}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-charcoal-900">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <a
          href={`https://wa.me/923001234567?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp Atelier Concierge</span>
          </Button>
        </a>

        <Link to={`/track?order=${order?.orderNumber || orderNumber}`} className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Live Order Tracking
          </Button>
        </Link>

        <Link to="/shop" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
