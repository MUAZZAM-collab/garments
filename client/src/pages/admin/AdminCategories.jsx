import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [image, setImage] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories/admin');
      if (res?.categories) setCategories(res.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = (cat = null) => {
    setEditingCat(cat);
    if (cat) {
      setName(cat.name);
      setSlug(cat.slug);
      setTagline(cat.tagline || '');
      setImage(cat.image || '');
      setSortOrder(String(cat.sortOrder || 0));
    } else {
      setName('');
      setSlug('');
      setTagline('');
      setImage('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800');
      setSortOrder('0');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline,
        image,
        sortOrder: Number(sortOrder),
      };

      if (editingCat) {
        await api.put(`/categories/${editingCat._id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
            Catalogue Taxonomies
          </span>
          <h1 className="font-serif text-3xl font-medium text-charcoal-900">
            Categories ({categories.length})
          </h1>
        </div>
        <Button onClick={() => openModal()} size="sm" className="flex items-center space-x-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </Button>
      </div>

      <div className="bg-white rounded-sm border border-charcoal-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Tagline</th>
                <th className="py-3 px-4">Sort Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-ivory-50/70">
                  <td className="py-2.5 px-4">
                    <img src={c.image} alt={c.name} className="w-12 h-14 object-cover rounded border" />
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-charcoal-900">{c.name}</td>
                  <td className="py-2.5 px-4 font-mono text-charcoal-500">{c.slug}</td>
                  <td className="py-2.5 px-4 text-charcoal-600">{c.tagline}</td>
                  <td className="py-2.5 px-4 font-mono font-medium">{c.sortOrder}</td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => openModal(c)} className="p-1 hover:text-charcoal-900">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="p-1 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCat ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Category Name *" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Slug (Leave empty to auto-generate)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Input label="Tagline / Short Subtitle" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          <Input label="Image URL *" required value={image} onChange={(e) => setImage(e.target.value)} />
          <Input label="Sort Order (0, 1, 2...)" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Category</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
