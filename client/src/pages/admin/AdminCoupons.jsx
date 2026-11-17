import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Crown } from 'lucide-react';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('10');
  const [minOrder, setMinOrder] = useState('3000');
  const [usageLimit, setUsageLimit] = useState('100');
  const [isVipOnly, setIsVipOnly] = useState(false);
  const [description, setDescription] = useState('');

  const loadCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      if (res?.coupons) setCoupons(res.coupons);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/coupons', {
        code,
        type,
        value: Number(value),
        minOrder: Number(minOrder),
        usageLimit: Number(usageLimit),
        isVipOnly,
        description,
      });

      if (res?.coupon) {
        setCoupons([res.coupon, ...coupons]);
        setIsModalOpen(false);
        setCode('');
      }
    } catch (err) {
      alert(`Failed to create coupon: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon code?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
            Marketing & VIP Codes
          </span>
          <h1 className="font-serif text-3xl font-medium text-charcoal-900">
            Privilege Promo Codes ({coupons.length})
          </h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="flex items-center space-x-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>New Promo Code</span>
        </Button>
      </div>

      <div className="bg-white rounded-sm border border-charcoal-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Type & Value</th>
                <th className="py-3 px-4">Min. Order</th>
                <th className="py-3 px-4">Usage</th>
                <th className="py-3 px-4">Expires</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-ivory-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-charcoal-900">
                    {c.code}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {c.type === 'percentage' ? `${c.value}% Off` : `PKR ${c.value} Off`}
                  </td>
                  <td className="py-3 px-4">{formatPrice(c.minOrder)}</td>
                  <td className="py-3 px-4">
                    {c.usedCount} / {c.usageLimit}
                  </td>
                  <td className="py-3 px-4 text-charcoal-500">
                    {formatDate(c.expiresAt)}
                  </td>
                  <td className="py-3 px-4">
                    {c.isVipOnly ? (
                      <Badge variant="gold" className="flex items-center space-x-1">
                        <Crown className="h-2.5 w-2.5" />
                        <span>VIP Exclusive</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline">Public</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(c._id)} className="p-1 text-charcoal-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Privilege Promo Code">
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
            label="Promo Code (Uppercase) *"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. SECRETDROP20"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                Discount Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs h-11 px-3 border border-charcoal-200 rounded-sm bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (PKR)</option>
              </select>
            </div>

            <div>
              <Input
                label="Value *"
                type="number"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="10 or 500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Minimum Order (PKR)"
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="3000"
              />
            </div>

            <div>
              <Input
                label="Usage Limit"
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="vipOnly"
              checked={isVipOnly}
              onChange={(e) => setIsVipOnly(e.target.checked)}
              className="rounded text-charcoal-900"
            />
            <label htmlFor="vipOnly" className="text-xs text-charcoal-700 cursor-pointer font-medium">
              Restrict to VIP Members (Rose Gold & Black Card only)
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Publish Promo Code</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
