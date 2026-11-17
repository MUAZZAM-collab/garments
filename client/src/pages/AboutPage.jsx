import React from 'react';
import { ShieldCheck, Sparkles, Heart, Award } from 'lucide-react';
import { TrustBadges } from '../components/common/TrustBadges';

export const AboutPage = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-12">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Our Heritage & Ethos
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-charcoal-900 font-normal leading-tight">
          The Art of Intimate Luxury in Pakistan
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl mx-auto font-light leading-relaxed">
          Founded in Karachi, VELOURA Privé was born out of a desire for undergarments that honor the modern Pakistani woman’s daily grace with couture European textiles, perfect fit engineering, and uncompromised privacy.
        </p>
      </section>

      {/* Narrative Section with Editorial Imagery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-luxury border border-charcoal-200">
            <img
              src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1200"
              alt="Atelier craft"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
              The Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal leading-snug">
              Quiet Confidence, Invisible Beneath Every Silhouette
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-charcoal-600 font-normal leading-relaxed">
              <p>
                Pakistani women wear an exquisite variety of textiles—from sheer lawn kurtis and crisp cottons to opulent embroidered bridal velvets and modern tailoring. Each ensemble demands foundations that enhance posture without pinching, chafing, or creating unsightly lines.
              </p>
              <p>
                At VELOURA Privé, our patterns are graded specifically for South Asian body proportions, integrating flexible non-poking memory underwires, organic modal gussets, and 100% natural Mulberry silk.
              </p>
              <p>
                Above all, we honor our patrons’ right to absolute confidentiality. We created the industry-standard discreet delivery protocol, ensuring your packages arrive with zero indicators of lingerie on the courier label.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="bg-ivory-100 border-y border-charcoal-200/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-sm border border-charcoal-200/50 shadow-sm space-y-3">
            <Award className="h-6 w-6 text-gold-vip" />
            <h3 className="font-serif text-xl font-semibold text-charcoal-900">Artisanal Materials</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Sourced directly from France and heritage Italian mills: OEKO-TEX Standard 100 Grade 6A pure silk and skin-soft floral lace.
            </p>
          </div>

          <div className="p-6 bg-white rounded-sm border border-charcoal-200/50 shadow-sm space-y-3">
            <ShieldCheck className="h-6 w-6 text-gold-vip" />
            <h3 className="font-serif text-xl font-semibold text-charcoal-900">Discretion Above All</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Every parcel is shipped in unmarked, opaque packaging. Confidential female phone support for sizing and telephone confirmation.
            </p>
          </div>

          <div className="p-6 bg-white rounded-sm border border-charcoal-200/50 shadow-sm space-y-3">
            <Heart className="h-6 w-6 text-gold-vip" />
            <h3 className="font-serif text-xl font-semibold text-charcoal-900">Complimentary Size Exchange</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              7-day seamless fit exchange guarantee so you can find your exact bra and loungewear size with zero apprehension.
            </p>
          </div>
        </div>
      </section>

      <TrustBadges />
    </div>
  );
};
