import React from 'react';
import { AccordionItem } from '../components/ui/Accordion';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const FaqPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Knowledge Sanctuary
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto leading-relaxed">
          Clear, reassuring answers regarding privacy, fitting, delivery schedules, and exchanges.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-sm border border-charcoal-200/80 shadow-soft">
        <AccordionItem title="Will anyone know what is inside the parcel when delivered?" defaultOpen={true}>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Absolutely not. 100% of our parcels are shipped in completely opaque, unbranded outer satchels. The courier shipping label mentions only "Fabric Goods" or "Apparel", with zero mention of lingerie, bras, or brand names. You can receive your parcel at home or work in total comfort.
          </p>
        </AccordionItem>

        <AccordionItem title="How does Cash on Delivery (COD) work?">
          <p className="text-xs text-charcoal-600 leading-relaxed">
            When you select Cash on Delivery at checkout, you pay the exact invoice amount in cash directly to the TCS or courier rider upon delivery. For your security, our female telephone concierge will place a brief, polite phone call to confirm your delivery address before dispatch.
          </p>
        </AccordionItem>

        <AccordionItem title="What if the bra or corset size does not fit perfectly?">
          <p className="text-xs text-charcoal-600 leading-relaxed">
            We provide a 7-day complimentary size exchange service for bras, robes, and sleepwear. Simply WhatsApp our concierge at +92 300 1234567 within 7 days of delivery with your order reference. Our team will dispatch the replacement size promptly. Items must remain unwashed with original tags attached.
          </p>
        </AccordionItem>

        <AccordionItem title="Can panties or bodysuits be exchanged?">
          <p className="text-xs text-charcoal-600 leading-relaxed">
            In accordance with international hygiene regulations and health guidelines, panties and bodysuits cannot be exchanged once the protective seal or hygiene liner has been opened.
          </p>
        </AccordionItem>

        <AccordionItem title="How do I wash and maintain 100% Mulberry Silk?">
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Our 22-Momme Grade 6A pure Mulberry silk should be hand-washed in cold water using a mild pH-neutral silk wash or baby shampoo. Never wring or twist. Lay flat on a clean dry towel away from direct sunlight. Iron on the lowest silk setting on the reverse side while slightly damp.
          </p>
        </AccordionItem>

        <AccordionItem title="How do I qualify for the Privé VIP Club?">
          <p className="text-xs text-charcoal-600 leading-relaxed">
            All registered patrons are enrolled immediately into the Silver tier with 100 welcome privilege points. When your cumulative spend reaches PKR 25,000, you are automatically promoted to Rose Gold (free shipping forever & 20% birthday discount). Reaching PKR 60,000 unlocks the Black Card tier with dedicated concierge styling.
          </p>
        </AccordionItem>
      </div>

      <div className="p-6 bg-ivory-100 rounded-sm border border-charcoal-200 text-center space-y-3">
        <h4 className="font-serif text-xl font-medium text-charcoal-900">Have a Question Not Listed Here?</h4>
        <p className="text-xs text-charcoal-500">Our discreet female styling team is available to assist you via WhatsApp.</p>
        <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm" className="mt-2">
            Ask Our Concierge
          </Button>
        </a>
      </div>
    </div>
  );
};
