import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Private Client Services
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal">
          Connect With Our Concierge
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto leading-relaxed">
          Confidential fit consultations, bridal trousseau inquiries, and order support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/80 shadow-soft space-y-6">
            <h3 className="font-serif text-2xl font-medium text-charcoal-900 border-b border-charcoal-100 pb-3">
              Direct Channels
            </h3>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-start space-x-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-sm hover:bg-emerald-50 transition-colors group"
            >
              <MessageCircle className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-emerald-900 uppercase tracking-wider block">
                  WhatsApp Concierge (Confidential)
                </strong>
                <span className="text-xs text-emerald-700 font-mono">+92 300 1234567</span>
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Instant female stylist advice, sizing assistance & order updates.
                </p>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-start space-x-3 text-xs text-charcoal-700">
              <Mail className="h-5 w-5 text-charcoal-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-900 block uppercase tracking-wider text-[11px]">Email</strong>
                <span>concierge@veloura.pk</span>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start space-x-3 text-xs text-charcoal-700">
              <Clock className="h-5 w-5 text-charcoal-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-900 block uppercase tracking-wider text-[11px]">Hours of Operation</strong>
                <span>Monday to Saturday, 10:00 AM – 8:00 PM PKT</span>
              </div>
            </div>

            {/* Studio location */}
            <div className="flex items-start space-x-3 text-xs text-charcoal-700">
              <MapPin className="h-5 w-5 text-charcoal-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-900 block uppercase tracking-wider text-[11px]">Private Atelier Studio</strong>
                <span>Clifton Block 4, Karachi, Pakistan (By Private Appointment Only)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-sm border border-charcoal-200/80 shadow-soft space-y-6">
          <h3 className="font-serif text-2xl font-medium text-charcoal-900">
            Send a Private Message
          </h3>

          {isSent ? (
            <div className="p-6 bg-emerald-50 text-emerald-800 text-xs rounded-sm border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-700" />
              <p className="font-medium text-sm">Thank you, {name || 'valued patron'}.</p>
              <p>Your confidential message has been received. Our female concierge will respond within 4 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                />
                <Input
                  label="Email Address *"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <Input
                label="Mobile Phone (+92) (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300 1234567"
              />

              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                  How may we assist you? *
                </label>
                <textarea
                  required
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquire about sizing, custom bridal sets, exchange request..."
                  className="w-full text-xs p-3 border border-charcoal-200 rounded-sm bg-white"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Dispatch Confidential Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
