import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Crown,
  ShieldCheck,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { AnnouncementBar } from './AnnouncementBar';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { getItemCount, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navCategories = [
    { name: 'Bras', path: '/shop?category=bras' },
    { name: 'Panties', path: '/shop?category=panties' },
    { name: 'Sets', path: '/shop?category=sets' },
    { name: 'Silk Sleepwear', path: '/shop?category=sleepwear' },
    { name: 'Shapewear', path: '/shop?category=shapewear' },
    { name: 'Bridal', path: '/shop?category=bridal' },
    { name: 'Basics', path: '/shop?category=basics' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory-200/95 backdrop-blur-md border-b border-charcoal-200/70 transition-all">
      <AnnouncementBar />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile hamburger & Desktop primary links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal-900 hover:text-rose-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <nav className="hidden lg:flex items-center space-x-7 text-[12px] uppercase tracking-[0.16em] font-medium text-charcoal-700">
              <Link to="/shop" className="hover:text-rose-accent transition-colors py-2">
                All Atelier
              </Link>
              <Link to="/shop?category=bras" className="hover:text-rose-accent transition-colors py-2">
                Bras
              </Link>
              <Link to="/shop?category=sets" className="hover:text-rose-accent transition-colors py-2">
                Sets
              </Link>
              <Link to="/shop?category=sleepwear" className="hover:text-rose-accent transition-colors py-2">
                Silk Sleepwear
              </Link>
              <Link to="/shop?category=bridal" className="text-rose-deep font-semibold hover:text-rose-hover transition-colors py-2">
                Bridal
              </Link>
            </nav>
          </div>

          {/* Center: Brand Wordmark */}
          <div className="text-center">
            <Link to="/" className="inline-block group text-center">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] uppercase text-charcoal-900 group-hover:text-rose-deep transition-colors font-semibold block">
                VELOURA
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-gold-vip font-sans block -mt-1 font-medium">
                PRIVÉ · ATELIER
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-charcoal-900">
            {/* VIP Club link (Desktop) */}
            <Link
              to="/account?tab=vip"
              className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-gold-vip/40 bg-gold-light/40 text-[11px] font-medium text-gold-dark hover:border-gold-vip transition-colors"
            >
              <Crown className="h-3.5 w-3.5 text-gold-vip" />
              <span className="tracking-widest uppercase">Privé Club</span>
            </Link>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-rose-accent transition-colors"
              aria-label="Search collection"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/account?tab=wishlist"
              className="p-2 hover:text-rose-accent transition-colors relative"
              aria-label="View wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-accent text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Auth */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-1 p-2 hover:text-rose-accent transition-colors"
                  >
                    <User className="h-5 w-5" />
                    {user?.tier && (
                      <span className="hidden sm:inline-block text-[10px] font-semibold text-gold-vip uppercase tracking-wider">
                        {user.tier === 'Black Card' ? 'VIP' : user.tier}
                      </span>
                    )}
                    <ChevronDown className="h-3 w-3 text-charcoal-400" />
                  </button>

                  {isUserDropdownOpen && (
                    <div
                      onMouseLeave={() => setIsUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 rounded-sm bg-white p-2 shadow-luxury border border-charcoal-200/60 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-charcoal-100 mb-1">
                        <p className="font-medium text-charcoal-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-charcoal-400 truncate">{user?.email}</p>
                        <div className="mt-1 flex items-center space-x-1">
                          <Crown className="h-3 w-3 text-gold-vip" />
                          <span className="text-[10px] font-semibold text-gold-vip uppercase">
                            {user?.tier || 'Silver'} Member
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-ivory-100 rounded-sm text-charcoal-700"
                      >
                        <User className="h-4 w-4" />
                        <span>My Account & Orders</span>
                      </Link>

                      <Link
                        to="/account?tab=vip"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gold-light/40 rounded-sm text-gold-dark font-medium"
                      >
                        <Crown className="h-4 w-4 text-gold-vip" />
                        <span>VIP Privilege Dashboard</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-charcoal-900 hover:text-ivory-50 rounded-sm font-medium text-charcoal-900 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Atelier Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-red-50 text-red-700 rounded-sm mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 hover:text-rose-accent transition-colors flex items-center space-x-1.5"
                  aria-label="Sign in"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-medium">Sign In</span>
                </Link>
              )}
            </div>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openDrawer}
              className="flex items-center space-x-2 bg-charcoal-900 text-ivory-50 hover:bg-charcoal-700 transition-colors px-3.5 py-2 rounded-sm shadow-soft"
              aria-label="View bag"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-[11px] uppercase tracking-widest font-semibold">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Search Bar */}
        {isSearchOpen && (
          <div className="py-3 px-2 border-t border-charcoal-200/50">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search silk slips, lace balconettes, bridal sets, shapewear..."
                className="w-full bg-white border border-charcoal-200 rounded-sm py-2.5 pl-10 pr-20 text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-charcoal-900"
                autoFocus
              />
              <Search className="h-4 w-4 text-charcoal-400 absolute left-3.5" />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 bg-charcoal-900 text-white text-[10px] uppercase tracking-widest rounded-sm hover:bg-charcoal-700"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-charcoal-200/60 bg-white/98 backdrop-blur-lg px-6 py-6 space-y-4 shadow-luxury animate-in slide-in-from-top duration-300">
          <div className="space-y-2 border-b border-charcoal-100 pb-4">
            <div className="text-[10px] uppercase tracking-widest font-bold text-charcoal-400 mb-2">
              Collections
            </div>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-serif tracking-wider text-charcoal-900 hover:text-rose-accent py-1.5"
            >
              All Atelier Pieces
            </Link>
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-serif tracking-wider text-charcoal-800 hover:text-rose-accent py-1.5"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="space-y-2 pt-2 text-xs uppercase tracking-widest font-medium text-charcoal-600">
            <Link
              to="/account?tab=vip"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-gold-dark font-semibold py-1.5"
            >
              <Crown className="h-4 w-4 text-gold-vip" />
              <span>Privé Society VIP Club</span>
            </Link>
            <Link
              to="/size-guide"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block hover:text-rose-accent py-1.5"
            >
              Atelier Sizing Guide
            </Link>
            <Link
              to="/track"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block hover:text-rose-accent py-1.5"
            >
              Track Your Order
            </Link>
            <Link
              to="/shipping-returns"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-1.5 hover:text-rose-accent py-1.5"
            >
              <ShieldCheck className="h-4 w-4 text-charcoal-400" />
              <span>100% Discreet Packaging Guarantee</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
