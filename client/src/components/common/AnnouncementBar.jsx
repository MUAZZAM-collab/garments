import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const announcements = [
  {
    icon: <ShieldCheck className="h-3.5 w-3.5 text-gold-vip" />,
    text: '100% Discreet Packaging Guaranteed · Zero Product Names on Courier Labels',
    link: '/shipping-returns',
  },
  {
    icon: <Truck className="h-3.5 w-3.5 text-gold-vip" />,
    text: 'Complimentary Nationwide Delivery Over PKR 3,500 · Cash on Delivery Available',
    link: '/shop',
  },
  {
    icon: <Sparkles className="h-3.5 w-3.5 text-gold-vip" />,
    text: 'Welcome Privilege: 10% Off Your First Order with Code: VELOURA10',
    link: '/shop',
  },
];

export const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIndex];

  return (
    <div className="bg-charcoal-900 text-ivory-100 text-[11px] py-2 px-4 border-b border-charcoal-700/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-charcoal-400">
          <span>Karachi · Lahore · Islamabad · Nationwide</span>
        </div>

        <Link
          to={current.link}
          className="flex-1 flex items-center justify-center space-x-2 hover:text-white transition-colors group cursor-pointer text-center"
        >
          {current.icon}
          <span className="tracking-wider uppercase font-medium">{current.text}</span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline" />
        </Link>

        <div className="hidden md:flex items-center space-x-4 text-charcoal-400">
          <Link to="/track" className="hover:text-ivory-100 transition-colors uppercase tracking-wider text-[10px]">
            Track Order
          </Link>
          <span>|</span>
          <Link to="/contact" className="hover:text-ivory-100 transition-colors uppercase tracking-wider text-[10px]">
            Concierge
          </Link>
        </div>
      </div>
    </div>
  );
};
