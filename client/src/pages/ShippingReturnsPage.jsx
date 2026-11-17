import React from 'react';
import { ShieldCheck, Truck, RefreshCw, PhoneCall, CheckCircle } from 'lucide-react';
import { TrustBadges } from '../components/common/TrustBadges';

export const ShippingReturnsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Nationwide Logistics & Discretion Protocol
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal">
          Shipping, Discretion & Exchanges
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-lg mx-auto leading-relaxed">
          Everything you need to know about our confidential packaging, delivery schedules, and 7-day fit exchange.
        </p>
      </div>

      {/* 1. Discreet Packaging Deep Dive */}
      <div className="bg-white p-6 sm:p-10 rounded-sm border border-charcoal-200/80 shadow-soft space-y-4">
        <div className="flex items-center space-x-3 text-gold-dark border-b border-charcoal-100 pb-4">
          <ShieldCheck className="h-6 w-6 text-gold-vip" />
          <h2 className="font-serif text-2xl font-medium text-charcoal-900">
            Our Sacred Discretion Guarantee
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-normal">
          We understand that shopping for intimates in Pakistan requires complete privacy and peace of mind. Every single order dispatched from our Karachi atelier adheres to the following strict standard:
        </p>
        <ul className="space-y-2.5 text-xs text-charcoal-700 pt-2">
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <span><strong>Unbranded Exterior:</strong> Your pieces are enclosed inside an opaque, sealed courier satchel. No logos, no brand name.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <span><strong>Zero Product Mentions:</strong> The courier air waybill displays only "Apparel" or "Fabric Goods"—undergarment terms are never printed.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <span><strong>Tamper-Evident Security Seal:</strong> Your magnetic inner box is sealed with a holographic security strip for absolute hygiene verification.</span>
          </li>
        </ul>
      </div>

      {/* 2. Delivery Rates & Timelines */}
      <div className="bg-white p-6 sm:p-10 rounded-sm border border-charcoal-200/80 shadow-soft space-y-4">
        <div className="flex items-center space-x-3 text-charcoal-900 border-b border-charcoal-100 pb-4">
          <Truck className="h-6 w-6 text-rose-deep" />
          <h2 className="font-serif text-2xl font-medium">Delivery Schedules & Rates</h2>
        </div>
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left">
            <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Courier Partner</th>
                <th className="py-2.5 px-3">Estimated Timeline</th>
                <th className="py-2.5 px-3">Shipping Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
              <tr>
                <td className="py-3 px-3 font-semibold">Karachi (Atelier City)</td>
                <td className="py-3 px-3">TCS Express / Trax</td>
                <td className="py-3 px-3">24 to 36 Hours</td>
                <td className="py-3 px-3">Free over PKR 3,500 (else PKR 250)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold">Lahore & Rawalpindi / Islamabad</td>
                <td className="py-3 px-3">TCS Express Air Cargo</td>
                <td className="py-3 px-3">24 to 48 Hours</td>
                <td className="py-3 px-3">Free over PKR 3,500 (else PKR 250)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold">Faisalabad, Multan, Peshawar, Sialkot</td>
                <td className="py-3 px-3">TCS Express</td>
                <td className="py-3 px-3">2 to 3 Business Days</td>
                <td className="py-3 px-3">Free over PKR 3,500 (else PKR 250)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold">Other Cities & AJK</td>
                <td className="py-3 px-3">TCS Express</td>
                <td className="py-3 px-3">3 to 5 Business Days</td>
                <td className="py-3 px-3">Free over PKR 3,500 (else PKR 250)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 7-Day Fit & Size Exchange */}
      <div className="bg-white p-6 sm:p-10 rounded-sm border border-charcoal-200/80 shadow-soft space-y-4">
        <div className="flex items-center space-x-3 text-charcoal-900 border-b border-charcoal-100 pb-4">
          <RefreshCw className="h-6 w-6 text-emerald-700" />
          <h2 className="font-serif text-2xl font-medium">7-Day Fit & Size Exchange Policy</h2>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
          We want you to feel utterly confident in your VELOURA fit. We gladly offer size exchanges for bras, sleepwear, and robes within 7 days of delivery.
        </p>
        <div className="p-4 bg-rose-light/50 border border-rose-accent/20 rounded-sm text-xs text-charcoal-700 space-y-1">
          <strong className="text-rose-deep block">Hygiene Standards:</strong>
          <p>
            Due to strict health and sanitation guidelines, panties and bodysuits cannot be exchanged once the protective hygiene strip has been removed. All items must be unwashed, unworn, and in their original packaging with tags attached.
          </p>
        </div>
      </div>

      <TrustBadges />
    </div>
  );
};
