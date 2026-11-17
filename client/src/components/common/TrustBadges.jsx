import React from 'react';
import { ShieldCheck, Truck, Banknote, RefreshCw } from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-gold-vip" />,
      title: '100% Discreet Packaging',
      description: 'Zero product names on courier labels. Opaque, tamper-evident bespoke packaging for complete privacy.',
    },
    {
      icon: <Banknote className="h-6 w-6 text-gold-vip" />,
      title: 'Cash on Delivery Available',
      description: 'Pay with absolute peace of mind upon parcel inspection across 120+ Pakistani cities.',
    },
    {
      icon: <Truck className="h-6 w-6 text-gold-vip" />,
      title: 'Nationwide Express Delivery',
      description: 'Complimentary shipping over PKR 3,500. 24–48hr delivery in Karachi & Lahore.',
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-gold-vip" />,
      title: 'Complimentary Size Exchange',
      description: '7-day seamless fit consultation & size exchange guarantee with dedicated concierge support.',
    },
  ];

  return (
    <section className="bg-ivory-100 border-y border-charcoal-200/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {badges.map((badge, idx) => (
          <div key={idx} className="flex items-start space-x-4">
            <div className="p-3 bg-white rounded-sm shadow-soft border border-charcoal-200/40 flex-shrink-0">
              {badge.icon}
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-charcoal-900 tracking-wide mb-1">
                {badge.title}
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
