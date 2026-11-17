import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Crown,
  ChevronRight,
  Star,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { TrustBadges } from '../components/common/TrustBadges';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'bestseller'
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catsRes, prodsRes, bannersRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=8'),
          api.get('/banners'),
        ]);

        if (catsRes?.categories) setCategories(catsRes.categories);
        if (prodsRes?.products) setFeaturedProducts(prodsRes.products);
        if (bannersRes?.banners) setBanners(bannersRes.banners);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
    }
  };

  const heroBanner = banners[0] || {
    title: 'The Trousseau & Silk Collection',
    subtitle: 'Artisanal French Lace & 100% Mulberry Silk Intimates Designed for Quiet Luxury',
    badgeText: 'WINTER 2026 COUTURE',
    ctaText: 'Explore New Arrivals',
    ctaLink: '/shop?tag=New+Arrival',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=85&w=1920',
  };

  const filteredProducts = featuredProducts.filter((p) => {
    if (activeTab === 'new') return p.tags?.includes('New Arrival') || p.isFeatured;
    return p.tags?.includes('Bestseller') || p.numReviews > 10;
  });

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Full-Bleed Editorial Hero */}
      <section className="relative h-[85vh] sm:h-[90vh] w-full overflow-hidden flex items-center justify-center bg-charcoal-900">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner.imageUrl}
            alt={heroBanner.title}
            className="w-full h-full object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-charcoal-900/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-ivory-50 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-gold-vip/50 bg-charcoal-900/60 backdrop-blur-md"
          >
            <Crown className="h-3.5 w-3.5 text-gold-vip" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-vip font-medium">
              {heroBanner.badgeText}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-wide text-white leading-[1.08]"
          >
            {heroBanner.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base text-ivory-300 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {heroBanner.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={heroBanner.ctaLink}>
              <Button size="lg" className="w-full sm:w-auto px-9">
                {heroBanner.ctaText}
              </Button>
            </Link>
            <Link to="/shop?category=bridal">
              <Button variant="outlineIvory" size="lg" className="w-full sm:w-auto px-9">
                The Bridal Trousseau
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Discreet packaging badge anchor */}
        <div className="absolute bottom-6 inset-x-0 text-center text-[11px] text-ivory-300/80 flex items-center justify-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-gold-vip" />
          <span>100% Confidential Delivery Guarantee · Unbranded Discreet Packaging Nationwide</span>
        </div>
      </section>

      {/* 2. Trust Badges Bar */}
      <TrustBadges />

      {/* 3. Shop by Category Editorial Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal">
            Shop by Category
          </h2>
          <p className="text-xs text-charcoal-600 font-normal leading-relaxed">
            From second-skin everyday seamless essentials to breathtaking French lace and pure silk loungewear.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <Skeleton key={n} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className={`group relative overflow-hidden rounded-sm bg-charcoal-900 border border-charcoal-200/50 ${
                  idx === 0 ? 'col-span-2 sm:col-span-2 aspect-[16/9] md:aspect-auto' : 'aspect-[4/5]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover object-center opacity-80 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/20 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest text-gold-vip font-medium">
                    Atelier
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal group-hover:text-rose-light transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-ivory-200/90 line-clamp-1 mt-0.5 font-light">
                    {cat.tagline || cat.description}
                  </p>
                  <div className="flex items-center space-x-1 text-[11px] uppercase tracking-wider text-white mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore Collection</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. Featured Products Tabs (New Arrivals & Bestsellers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-charcoal-200/60 pb-4 mb-8 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
              The Atelier Edit
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal">
              Signature Pieces
            </h2>
          </div>

          <div className="flex items-center space-x-4 border border-charcoal-200 rounded-sm p-1 bg-white">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
                activeTab === 'new'
                  ? 'bg-charcoal-900 text-ivory-50 shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-charcoal-900 text-ivory-50 shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Bestsellers
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-2">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center pt-10">
          <Link to="/shop">
            <Button variant="outline" size="lg" className="px-10">
              View All Atelier Collections
            </Button>
          </Link>
        </div>
      </section>

      {/* 5. VIP Program Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-berry-dark p-8 sm:p-14 text-ivory-50 border border-gold-vip/30 shadow-luxury">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1200"
              alt="Silk texture"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold-vip/40 bg-gold-light/10 text-gold-vip text-[11px] font-semibold uppercase tracking-widest">
              <Crown className="h-3.5 w-3.5" />
              <span>The Privé VIP Society</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
              An Elevated World of Discretion & Exclusivity
            </h3>

            <p className="text-xs sm:text-sm text-ivory-300 font-light leading-relaxed">
              Ascend from <strong className="text-white">Silver</strong> to <strong className="text-rose-300">Rose Gold</strong> and the coveted <strong className="text-gold-vip">Black Card</strong> tier. Enjoy 24-hour early drop access, complimentary nationwide shipping, confidential WhatsApp styling, and birthday privileges.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="border border-white/10 p-3 rounded-sm bg-white/5">
                <span className="text-gold-vip text-[10px] uppercase font-bold tracking-widest block">Silver</span>
                <span className="text-white font-medium">100 Welcome Points</span>
              </div>
              <div className="border border-gold-vip/30 p-3 rounded-sm bg-white/5">
                <span className="text-rose-accent text-[10px] uppercase font-bold tracking-widest block">Rose Gold</span>
                <span className="text-white font-medium">Free Shipping Forever</span>
              </div>
              <div className="border border-gold-vip/60 p-3 rounded-sm bg-gold-vip/10">
                <span className="text-gold-vip text-[10px] uppercase font-bold tracking-widest block">Black Card</span>
                <span className="text-white font-medium">Dedicated Concierge</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/account?tab=vip">
                <Button variant="gold" size="default">
                  Explore VIP Privileges
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Brand Story & Craftsmanship Split Layout */}
      <section className="bg-ivory-100 border-y border-charcoal-200/50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-luxury border border-charcoal-200/60">
                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200"
                  alt="Pure Mulberry Silk and French Lace Atelier"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-white border border-charcoal-200 rounded-sm shadow-soft max-w-xs hidden sm:block">
                <p className="font-serif text-sm italic text-charcoal-800">
                  "Lingerie is the intimate foundation of every woman’s day. It should never be an afterthought."
                </p>
                <span className="text-[10px] uppercase tracking-widest text-gold-dark font-semibold mt-2 block">
                  — Atelier Director, VELOURA Privé
                </span>
              </div>
            </div>

            {/* Editorial copy */}
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
                Our Heritage & Promise
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal leading-tight">
                Crafted for Sensual Grace. Tailored for Absolute Comfort.
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-charcoal-600 font-normal leading-relaxed">
                <p>
                  VELOURA Privé was established with a singular vision: to liberate the modern Pakistani woman from uncomfortable, generic intimates through haute European materials and culturally sensitive design.
                </p>
                <p>
                  Every wire is wrapped in memory foam; every lace is tested for zero-scratch softness; every seam on our slip dresses is cut on the true bias to celebrate natural feminine curves without constriction.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-charcoal-200/80">
                <div>
                  <h4 className="font-serif text-2xl text-charcoal-900 font-medium">100%</h4>
                  <p className="text-xs text-charcoal-500">OEKO-TEX Certified Grade 6A Pure Mulberry Silk</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-charcoal-900 font-medium">120+</h4>
                  <p className="text-xs text-charcoal-500">Pakistani Cities Served with Confidential COD</p>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/about">
                  <Button variant="outline" size="default">
                    Read Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Instagram-style Lookbook Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
            The Lookbook
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal">
            Moments of Quiet Luxury
          </h2>
          <p className="text-xs text-charcoal-600 font-normal">
            Follow our private aesthetic journey @veloura.prive
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
          ].map((url, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-sm bg-charcoal-200">
              <img
                src={url}
                alt="VELOURA Atelier lookbook vignette"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="text-[10px] uppercase tracking-widest font-medium">VELOURA</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter Signup with Discount Incentive */}
      <section className="bg-charcoal-900 text-ivory-50 py-16 sm:py-20 border-t border-charcoal-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold-vip/40 bg-gold-light/10 text-gold-vip text-[10px] font-semibold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            <span>Exclusive Welcome Privilege</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
            Join The Privé Society
          </h2>

          <p className="text-xs sm:text-sm text-charcoal-400 max-w-lg mx-auto font-light leading-relaxed">
            Subscribe to receive private invitations to secret silk drops, confidential fitting events, and enjoy <strong className="text-white">10% off your inaugural order</strong> with code <code className="text-gold-vip bg-charcoal-800 px-1.5 py-0.5 rounded">VELOURA10</code>.
          </p>

          {newsletterSuccess ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-sm text-emerald-300 text-xs flex items-center justify-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Welcome to the Privé Society. Use code <strong>VELOURA10</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 h-12 px-4 rounded-sm bg-charcoal-800 border border-charcoal-700 text-white placeholder:text-charcoal-500 text-xs focus:outline-none focus:border-gold-vip"
              />
              <Button type="submit" variant="gold" size="default" className="whitespace-nowrap">
                Claim 10% Off
              </Button>
            </form>
          )}

          <p className="text-[10px] text-charcoal-500">
            We value your privacy unequivocally. Zero spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};
