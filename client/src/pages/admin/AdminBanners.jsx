import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('WINTER 2026 COUTURE');
  const [ctaText, setCtaText] = useState('Explore New Arrivals');
  const [ctaLink, setCtaLink] = useState('/shop?tag=New+Arrival');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('1');

  const loadBanners = async () => {
    try {
      const res = await api.get('/banners/admin');
      if (res?.banners) setBanners(res.banners);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openModal = (banner = null) => {
    setEditingBanner(banner);
    if (banner) {
      setTitle(banner.title);
      setSubtitle(banner.subtitle || '');
      setBadgeText(banner.badgeText || '');
      setCtaText(banner.ctaText || 'Explore Collection');
      setCtaLink(banner.ctaLink || '/shop');
      setImageUrl(banner.imageUrl);
      setSortOrder(String(banner.sortOrder || 1));
    } else {
      setTitle('');
      setSubtitle('');
      setBadgeText('SEASONAL COUTURE');
      setCtaText('Shop Collection');
      setCtaLink('/shop');
      setImageUrl('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=85&w=1920');
      setSortOrder('1');
    }
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        subtitle,
        badgeText,
        ctaText,
        ctaLink,
        imageUrl,
        sortOrder: Number(sortOrder),
      };

      if (editingBanner) {
        await api.put(`/banners/${editingBanner._id}`, payload);
      } else {
        await api.post('/banners', payload);
      }

      setIsModalOpen(false);
      loadBanners();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hero banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      setBanners(banners.filter((b) => b._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
            Visual Merchandising
          </span>
          <h1 className="font-serif text-3xl font-medium text-charcoal-900">
            Homepage Hero Banners ({banners.length})
          </h1>
        </div>
        <Button onClick={() => openModal()} size="sm" className="flex items-center space-x-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>New Hero Banner</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white rounded-sm border border-charcoal-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-charcoal-900 overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[9px] uppercase tracking-widest text-gold-vip font-semibold">
                  {banner.badgeText}
                </span>
                <h4 className="font-serif text-lg font-medium leading-tight">{banner.title}</h4>
              </div>
            </div>

            <div className="p-4 space-y-2 text-xs">
              <p className="text-charcoal-600 line-clamp-2">{banner.subtitle}</p>
              <div className="flex justify-between items-center pt-2 border-t border-charcoal-100 text-[11px] text-charcoal-500">
                <span>
                  CTA: <strong>{banner.ctaText}</strong> ({banner.ctaLink})
                </span>
                <div className="flex space-x-2">
                  <button onClick={() => openModal(banner)} className="p-1 text-charcoal-600 hover:text-charcoal-900">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="p-1 text-charcoal-600 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
      >
        <form onSubmit={handleSaveBanner} className="space-y-4">
          <Input label="Main Heading *" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Subtitle *" required value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          <Input label="Badge Text (e.g. WINTER 2026 COUTURE)" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="CTA Button Label" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
            <Input label="CTA Target Link" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} />
          </div>
          <Input label="High-Res Banner Image URL *" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <Input label="Sort Order" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Banner</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
