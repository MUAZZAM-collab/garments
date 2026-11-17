import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const res = await register(name, email, phone, password);
    if (res.success) {
      navigate('/account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-light/40 border border-gold-vip/30 text-gold-dark text-[10px] font-semibold uppercase tracking-widest mb-1">
          <Sparkles className="h-3 w-3 text-gold-vip" />
          <span>Earn 100 Welcome Privilege Points</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal">
          Join VELOURA Privé
        </h1>
        <p className="text-xs text-charcoal-500 font-light">
          Create your atelier sanctuary for early drops, discreet delivery, and VIP rewards.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-sm border border-red-200 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/70 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mahnoor Khan"
          />

          <Input
            label="Email Address *"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@example.com"
          />

          <Input
            label="Mobile Phone (+92) *"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0300 1234567"
          />

          <Input
            label="Create Password (Min. 6 characters) *"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
            Create Account & Join VIP Club
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-charcoal-100 text-center text-xs text-charcoal-600">
          <span>Already registered? </span>
          <Link to="/login" className="text-rose-deep font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>

      <div className="text-center flex items-center justify-center space-x-2 text-[11px] text-charcoal-500">
        <ShieldCheck className="h-3.5 w-3.5 text-gold-vip" />
        <span>100% Confidential Data Protection</span>
      </div>
    </div>
  );
};
