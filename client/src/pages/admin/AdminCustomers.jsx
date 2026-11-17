import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Edit2, Search } from 'lucide-react';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // VIP Tier modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [newTier, setNewTier] = useState('Silver');
  const [newPoints, setNewPoints] = useState(100);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/users/admin/customers');
      if (res?.customers) setCustomers(res.customers);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const openTierModal = (user) => {
    setSelectedUser(user);
    setNewTier(user.tier || 'Silver');
    setNewPoints(user.loyaltyPoints || 0);
  };

  const handleUpdateTier = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const res = await api.put(`/users/admin/${selectedUser._id}/tier`, {
        tier: newTier,
        loyaltyPoints: Number(newPoints),
      });
      if (res?.user) {
        setCustomers(customers.map((c) => (c._id === res.user._id ? { ...c, tier: newTier, loyaltyPoints: Number(newPoints) } : c)));
        setSelectedUser(null);
      }
    } catch (err) {
      alert(`Failed to update tier: ${err.message}`);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
          Clientele Portfolio
        </span>
        <h1 className="font-serif text-3xl font-medium text-charcoal-900">
          Patrons & VIP Society ({customers.length})
        </h1>
      </div>

      <div className="bg-white p-4 rounded-sm border border-charcoal-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-charcoal-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name, phone, or email..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-charcoal-200 rounded-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-sm border border-charcoal-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
              <tr>
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">VIP Tier</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              {filtered.map((user) => (
                <tr key={user._id} className="hover:bg-ivory-50/70">
                  <td className="py-3 px-4 font-semibold text-charcoal-900 flex items-center space-x-1.5">
                    {user.tier === 'Black Card' && <Crown className="h-3.5 w-3.5 text-gold-vip" />}
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3 px-4 text-charcoal-600">{user.email}</td>
                  <td className="py-3 px-4 font-mono">{user.phone}</td>
                  <td className="py-3 px-4 font-semibold text-charcoal-900">
                    {formatPrice(user.lifetimeSpend || 0)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.tier === 'Black Card' ? 'gold' : user.tier === 'Rose Gold' ? 'rose' : 'outline'}>
                      {user.tier || 'Silver'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {user.loyaltyPoints?.toLocaleString() || 0} pts
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openTierModal(user)}
                      className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-charcoal-900 text-ivory-50 rounded hover:bg-charcoal-700 font-medium"
                    >
                      Promote VIP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIP Promotion Modal */}
      {selectedUser && (
        <Modal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title={`Modify VIP Status: ${selectedUser.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleUpdateTier} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                Assign VIP Tier
              </label>
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                className="w-full text-xs h-10 px-3 border border-charcoal-200 rounded-sm bg-white"
              >
                <option value="Silver">Silver Tier (Standard)</option>
                <option value="Rose Gold">Rose Gold Tier (Free Shipping & 20% Privilege)</option>
                <option value="Black Card">Black Card Tier (Concierge & Custom Monogramming)</option>
              </select>
            </div>

            <Input
              label="Privilege Points Balance"
              type="number"
              value={newPoints}
              onChange={(e) => setNewPoints(e.target.value)}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save VIP Status
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
