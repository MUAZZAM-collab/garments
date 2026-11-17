import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShieldCheck, CheckCircle2, Clock, Truck, Package, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { formatPrice, formatDate } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      setOrder(null);

      const query = phone.trim() ? `?phone=${encodeURIComponent(phone.trim())}` : '';
      const data = await api.get(`/orders/${orderNumber.trim().toUpperCase()}${query}`);

      if (data?.order) {
        setOrder(data.order);
      } else {
        setError('No order found matching this reference.');
      }
    } catch (err) {
      setError(err.message || 'Order not found. Please verify your reference number and mobile phone.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('order')) {
      handleTrack();
    }
  }, [searchParams]);

  const stages = [
    { key: 'Pending', label: 'Order Placed', desc: 'Received by Atelier' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Telephone Concierge Call' },
    { key: 'Packed', label: 'Discreetly Packed', desc: 'Unmarked Opaque Box' },
    { key: 'Shipped', label: 'In Transit', desc: 'TCS Express Courier' },
    { key: 'Delivered', label: 'Delivered', desc: 'Complete Discretion' },
  ];

  const getStageStatus = (stageKey) => {
    const statusOrder = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(order?.orderStatus || 'Pending');
    const stageIndex = statusOrder.indexOf(stageKey);

    if (order?.orderStatus === 'Cancelled') return 'cancelled';
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Nationwide Logistics Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal">
          Track Your Confidential Parcel
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto">
          Enter your order reference (e.g. VP-2026-89412) to view live fulfillment progress.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/70 shadow-soft">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <Input
              label="Order Reference *"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. VP-2026-89412"
              required
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              label="Recipient Phone (Optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XX XXXXXXX"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              size="default"
              isLoading={isLoading}
              className="w-full h-11"
            >
              Track
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-sm border border-red-200 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Results */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/70 shadow-soft space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-charcoal-100 pb-4 gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-400">
                Order Reference: {order.orderNumber}
              </span>
              <h3 className="font-serif text-2xl font-medium text-charcoal-900">
                Current Status: <span className="text-rose-deep">{order.orderStatus}</span>
              </h3>
            </div>
            <div className="text-xs text-charcoal-600 sm:text-right">
              {order.trackingNumber && (
                <p>
                  <strong>{order.courierName || 'TCS Express'} Tracking:</strong>{' '}
                  <span className="font-mono text-charcoal-900 bg-ivory-100 px-2 py-0.5 rounded">
                    {order.trackingNumber}
                  </span>
                </p>
              )}
              <p className="text-charcoal-400 mt-1">Placed on: {formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {stages.map((stage, idx) => {
              const status = getStageStatus(stage.key);
              return (
                <div key={idx} className="flex sm:flex-col items-center sm:items-center text-center space-x-3 sm:space-x-0 relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all flex-shrink-0 mb-2 ${
                      status === 'completed'
                        ? 'bg-charcoal-900 border-charcoal-900 text-ivory-50'
                        : status === 'current'
                        ? 'bg-rose-accent border-rose-deep text-white animate-pulse'
                        : 'bg-white border-charcoal-200 text-charcoal-400'
                    }`}
                  >
                    {status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  <div className="text-left sm:text-center">
                    <h5 className="font-medium text-xs text-charcoal-900">{stage.label}</h5>
                    <p className="text-[10px] text-charcoal-400">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Discreet Assurance Box */}
          <div className="p-4 bg-ivory-100 rounded-sm border border-charcoal-200/60 flex items-center space-x-3 text-xs text-charcoal-700">
            <ShieldCheck className="h-5 w-5 text-gold-vip flex-shrink-0" />
            <span>
              <strong>Discretion Notice:</strong> Your courier will hand you an unbranded, completely sealed package.
            </span>
          </div>

          {/* Order Items */}
          <div className="border-t border-charcoal-100 pt-4 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400 block">
              Package Contents
            </span>
            <div className="divide-y divide-charcoal-100">
              {order.items.map((item, i) => (
                <div key={i} className="py-2 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.title} className="w-10 h-14 object-cover rounded-sm border" />
                    <div>
                      <p className="font-medium text-charcoal-900">{item.title}</p>
                      <p className="text-[11px] text-charcoal-500">
                        Size: {item.variant.size} · Color: {item.variant.color} · Qty: {item.qty}
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
    </div>
  );
};
