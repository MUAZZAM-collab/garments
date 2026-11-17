import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          High-Trust Commitment
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal">
          Privacy & Discretion Policy
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-lg mx-auto leading-relaxed">
          Your privacy is the core pillar upon which VELOURA Privé was established.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-sm border border-charcoal-200/80 shadow-soft space-y-8 text-xs text-charcoal-700 leading-relaxed font-normal">
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-medium text-charcoal-900">1. Discretion & Courier Packaging</h3>
          <p>
            We hold your confidence as a sacred duty. Under no circumstances will our outer parcel packaging feature the brand name "VELOURA", "Privé", or any references to intimate apparel, lingerie, or underwear. The courier air waybill displays only generic descriptions (such as "Garments") to protect your confidentiality with building staff, family members, or courier riders.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-xl font-medium text-charcoal-900">2. Collection of Personal Data</h3>
          <p>
            We collect personal information solely to fulfill your orders, verify Cash on Delivery addresses via confidential telephone confirmation, and provide sizing concierge advice. This includes your name, mobile phone number, shipping address, and email address. We never sell, rent, or trade customer data to any third-party marketing entities.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-xl font-medium text-charcoal-900">3. Data Security & Encryption</h3>
          <p>
            Our web application uses 256-bit Secure Socket Layer (SSL) encryption for all transactions. Authentication tokens are transmitted in secure, httpOnly cookies protected against cross-site scripting (XSS). Passwords are cryptographically salted and hashed using bcrypt with zero plaintext storage.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-xl font-medium text-charcoal-900">4. Patron Rights</h3>
          <p>
            You retain the full right to inspect, correct, or request the deletion of your account history and personal details at any time by contacting our confidential data liaison at concierge@veloura.pk.
          </p>
        </div>
      </div>
    </div>
  );
};
