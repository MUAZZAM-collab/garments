import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Image as ImageIcon,
  LogOut,
  Store,
  Crown,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
    { name: 'Products & Variants', path: '/admin/products', icon: <Package className="h-4 w-4" /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers className="h-4 w-4" /> },
    { name: 'Orders & Tracking', path: '/admin/orders', icon: <ShoppingBag className="h-4 w-4" /> },
    { name: 'Customers & VIP', path: '/admin/customers', icon: <Users className="h-4 w-4" /> },
    { name: 'Coupons & Promos', path: '/admin/coupons', icon: <Tag className="h-4 w-4" /> },
    { name: 'Client Reviews', path: '/admin/reviews', icon: <Star className="h-4 w-4" /> },
    { name: 'Hero Banners', path: '/admin/banners', icon: <ImageIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-charcoal-100 flex flex-col md:flex-row text-charcoal-900 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal-900 text-ivory-100 flex-shrink-0 flex flex-col justify-between border-r border-charcoal-700">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-charcoal-700/80">
            <Link to="/admin" className="block">
              <span className="font-serif text-2xl tracking-[0.2em] uppercase text-white font-semibold">
                VELOURA
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-vip block -mt-1 font-medium">
                ATELIER ADMIN PANEL
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                    isActive
                      ? 'bg-rose-deep text-white shadow-soft font-semibold'
                      : 'text-charcoal-400 hover:bg-charcoal-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User bar & Store link */}
        <div className="p-4 border-t border-charcoal-700/80 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-charcoal-300">
            <Crown className="h-3.5 w-3.5 text-gold-vip" />
            <span className="truncate">{user?.name} (Admin)</span>
          </div>

          <Link
            to="/"
            className="flex items-center space-x-2 text-charcoal-400 hover:text-white py-1.5 transition-colors"
          >
            <Store className="h-4 w-4" />
            <span>View Public Storefront</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 py-1.5 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
