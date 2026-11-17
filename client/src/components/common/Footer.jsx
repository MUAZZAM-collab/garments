import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Mail, Phone, Lock, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-ivory-200 border-t border-charcoal-700/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Discreet Banner */}
        <div className="bg-charcoal-700/40 border border-charcoal-700 p-6 rounded-sm mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-charcoal-900 rounded-sm border border-gold-vip/30">
              <ShieldCheck className="h-7 w-7 text-gold-vip" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white font-medium">The VELOURA Discretion Guarantee</h4>
              <p className="text-xs text-charcoal-400 max-w-xl">
                Every order is enclosed in unmarked, opaque packaging with no lingerie brand or product descriptions visible on the exterior label. Your absolute privacy is our highest priority.
              </p>
            </div>
          </div>
          <Link
            to="/shipping-returns"
            className="px-5 py-2.5 rounded-sm border border-ivory-200/40 text-xs tracking-widest uppercase hover:bg-ivory-200 hover:text-charcoal-900 transition-colors whitespace-nowrap"
          >
            Learn More
          </Link>
        </div>

        {/* 4 Column Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-charcoal-700/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl tracking-[0.2em] uppercase text-white font-semibold block">
              VELOURA
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-vip block -mt-2">
              PRIVÉ · ATELIER
            </span>
            <p className="text-xs text-charcoal-400 leading-relaxed pr-6 pt-2">
              Redefining Pakistani intimate luxury through French Chantilly lace, pure 100% Mulberry silk, and thoughtful ergonomic design. Crafted for grace, ease, and unwavering confidence.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-charcoal-400">
              <span className="flex items-center space-x-1">
                <Lock className="h-3.5 w-3.5 text-gold-vip" />
                <span>256-Bit SSL Secured</span>
              </span>
              <span>·</span>
              <span>Nationwide COD</span>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-gold-vip">Atelier Collections</h5>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link to="/shop?category=bras" className="hover:text-white transition-colors">Bras & Bralettes</Link></li>
              <li><Link to="/shop?category=panties" className="hover:text-white transition-colors">Seamless Panties</Link></li>
              <li><Link to="/shop?category=sets" className="hover:text-white transition-colors">Matching Sets</Link></li>
              <li><Link to="/shop?category=sleepwear" className="hover:text-white transition-colors">Mulberry Silk Sleepwear</Link></li>
              <li><Link to="/shop?category=shapewear" className="hover:text-white transition-colors">Sculpting Shapewear</Link></li>
              <li><Link to="/shop?category=bridal" className="hover:text-white transition-colors">Bridal Trousseau</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-gold-vip">Client Concierge</h5>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide & Calculator</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Discreet Delivery & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Discretion & Privacy Policy</Link></li>
              <li><Link to="/account?tab=vip" className="hover:text-white transition-colors">The Privé VIP Society</Link></li>
            </ul>
          </div>

          {/* Contact / Atelier */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-gold-vip">Direct Atelier</h5>
            <p className="text-xs text-charcoal-400 leading-relaxed">
              Our confidential female stylists are available Monday to Saturday, 10am – 8pm PKT.
            </p>
            <div className="space-y-2 pt-1 text-xs text-charcoal-300">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-emerald-400 hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Concierge: +92 300 1234567</span>
              </a>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-charcoal-400" />
                <span>concierge@veloura.pk</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-charcoal-400" />
                <span>Karachi Studio: Clifton Block 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-charcoal-400 gap-4">
          <div>
            © {new Date().getFullYear()} VELOURA Privé. All rights reserved. Crafted with fine precision for Pakistan.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-charcoal-300">Accepted:</span>
            <span className="px-2 py-0.5 bg-charcoal-800 rounded text-[10px] text-ivory-100 font-medium">Cash on Delivery</span>
            <span className="px-2 py-0.5 bg-charcoal-800 rounded text-[10px] text-ivory-100 font-medium">JazzCash</span>
            <span className="px-2 py-0.5 bg-charcoal-800 rounded text-[10px] text-ivory-100 font-medium">Easypaisa</span>
            <span className="px-2 py-0.5 bg-charcoal-800 rounded text-[10px] text-ivory-100 font-medium">Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
