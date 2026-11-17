import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Crown, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          Client Sanctuary
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-charcoal-500 font-light">
          Access your private wishlist, order history, and VIP Society rewards.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Cards */}
      <div className="p-4 bg-white rounded-sm border border-charcoal-200/70 shadow-sm space-y-2.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-500 block">
          Quick Demo Credentials
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('admin@veloura.pk', 'Admin@123456')}
            className="p-2.5 text-left border border-charcoal-200 rounded-sm hover:border-charcoal-900 bg-ivory-50 transition-colors text-xs"
          >
            <div className="font-semibold text-charcoal-900 flex items-center space-x-1">
              <Crown className="h-3 w-3 text-gold-vip" />
              <span>Admin Atelier</span>
            </div>
            <p className="text-[10px] text-charcoal-500 truncate">admin@veloura.pk</p>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials('sara@veloura.pk', 'Customer@123456')}
            className="p-2.5 text-left border border-gold-vip/40 rounded-sm hover:border-gold-vip bg-gold-light/20 transition-colors text-xs"
          >
            <div className="font-semibold text-gold-dark flex items-center space-x-1">
              <Crown className="h-3 w-3 text-gold-vip" />
              <span>VIP Rose Gold</span>
            </div>
            <p className="text-[10px] text-charcoal-500 truncate">sara@veloura.pk</p>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-sm border border-red-200 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/70 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-charcoal-100 text-center text-xs text-charcoal-600">
          <span>New to VELOURA Privé? </span>
          <Link to="/register" className="text-rose-deep font-semibold hover:underline">
            Create an Account & Earn 100 Points
          </Link>
        </div>
      </div>

      <div className="text-center flex items-center justify-center space-x-2 text-[11px] text-charcoal-500">
        <ShieldCheck className="h-3.5 w-3.5 text-gold-vip" />
        <span>Confidential Authentication & Discretion Guaranteed</span>
      </div>
    </div>
  );
};
