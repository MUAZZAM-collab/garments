import React, { useState, useEffect } from 'react';
import { Plus, Search, Download, Edit2, Trash2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [fabric, setFabric] = useState('100% Grade 6A Mulberry Silk');
  const [tags, setTags] = useState('New Arrival, Luxury');
  const [imageUrl, setImageUrl] = useState('');
  const [variantsList, setVariantsList] = useState([
    { size: '34B', color: 'Dusty Rose', colorHex: '#B76E79', stock: 10, sku: 'VEL-34B-ROSE' },
    { size: '36B', color: 'Dusty Rose', colorHex: '#B76E79', stock: 8, sku: 'VEL-36B-ROSE' },
  ]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prodsRes, catsRes] = await Promise.all([
        api.get('/products?limit=50'),
        api.get('/categories'),
      ]);
      if (prodsRes?.products) setProducts(prodsRes.products);
      if (catsRes?.categories) setCategories(catsRes.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setCategory(categories[0]?._id || '');
    setPrice('4500');
    setComparePrice('5500');
    setFabric('Fine Silk & French Chantilly Lace');
    setTags('New Arrival, Bestseller');
    setImageUrl('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800');
    setVariantsList([
      { size: '34B', color: 'Dusty Rose', colorHex: '#B76E79', stock: 10, sku: 'PROD-34B-ROSE' },
      { size: '36B', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 8, sku: 'PROD-36B-NOIR' },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description);
    setCategory(prod.category?._id || prod.category);
    setPrice(String(prod.price));
    setComparePrice(prod.comparePrice ? String(prod.comparePrice) : '');
    setFabric(prod.fabric);
    setTags(prod.tags?.join(', ') || '');
    setImageUrl(prod.images?.[0]?.url || '');
    setVariantsList(
      prod.variants?.length > 0
        ? prod.variants
        : [{ size: '34B', color: 'Dusty Rose', colorHex: '#B76E79', stock: 5, sku: 'SKU-01' }]
    );
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        category,
        price: Number(price),
        comparePrice: comparePrice ? Number(comparePrice) : null,
        fabric,
        tags: tags.split(',').map((t) => t.trim()),
        images: [{ url: imageUrl, alt: title, isPrimary: true }],
        variants: variantsList,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you wish to archive this piece from the atelier?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    window.open('/api/admin/products/export-csv', '_blank');
  };

  const addVariantRow = () => {
    setVariantsList([
      ...variantsList,
      { size: '34C', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 10, sku: `SKU-${Date.now().toString().slice(-4)}` },
    ]);
  };

  const updateVariantRow = (index, field, value) => {
    const updated = [...variantsList];
    updated[index][field] = field === 'stock' ? Number(value) : value;
    setVariantsList(updated);
  };

  const removeVariantRow = (index) => {
    setVariantsList(variantsList.filter((_, i) => i !== index));
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.fabric?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory ? (p.category?.slug === selectedCategory || p.category === selectedCategory) : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
            Product Catalogue
          </span>
          <h1 className="font-serif text-3xl font-medium text-charcoal-900">
            Atelier Collection ({products.length})
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={openCreateModal}
            size="sm"
            className="flex items-center space-x-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Piece</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-charcoal-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-charcoal-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or fabric..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-charcoal-200 rounded-sm focus:outline-none focus:border-charcoal-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-charcoal-500 whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 border border-charcoal-200 rounded-sm bg-white focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-sm border border-charcoal-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
              <tr>
                <th className="py-3 px-4">Piece</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Variants / Stock</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              {filtered.map((prod) => {
                const totalStock = prod.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) ?? 0;
                return (
                  <tr key={prod._id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.images?.[0]?.url}
                          alt={prod.title}
                          className="w-10 h-14 object-cover rounded-sm border border-charcoal-200"
                        />
                        <div>
                          <strong className="text-charcoal-900 font-medium block truncate max-w-[200px]">
                            {prod.title}
                          </strong>
                          <span className="text-[10px] text-charcoal-400">{prod.fabric}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {prod.category?.name || prod.categoryName || 'General'}
                    </td>

                    <td className="py-3 px-4 font-semibold">
                      {formatPrice(prod.price)}
                      {prod.comparePrice && (
                        <span className="text-[10px] text-charcoal-400 line-through block font-normal">
                          {formatPrice(prod.comparePrice)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-charcoal-900">{totalStock} units</span>
                      <span className="text-[10px] text-charcoal-500 block">
                        across {prod.variants?.length || 0} variants
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.tags?.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[9px] bg-ivory-100 text-charcoal-700 border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={prod.isActive ? 'success' : 'outline'}>
                        {prod.isActive ? 'Active' : 'Draft'}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                          title="Edit piece"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 text-charcoal-500 hover:text-red-600 transition-colors"
                          title="Archive piece"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Atelier Design' : 'Create New Atelier Design'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Product Title *"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Aura Chantilly Lace Balconette Bra"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full h-11 px-3 bg-white border border-charcoal-200 rounded-sm text-sm"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Fabric Composition *"
                required
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% Grade 6A Mulberry Silk"
              />
            </div>

            <div>
              <Input
                label="Price (PKR) *"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="4850"
              />
            </div>

            <div>
              <Input
                label="Compare Price (PKR) (Optional)"
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="5800"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Tags (Comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="New Arrival, Bestseller, Silk, VIP Exclusive"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Primary Image URL *"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                Description *
              </label>
              <textarea
                required
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-3 border border-charcoal-200 rounded-sm bg-white"
                placeholder="Provide luxurious editorial description..."
              />
            </div>
          </div>

          {/* Variants section */}
          <div className="border-t border-charcoal-200 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Variants (Size × Color × Stock × SKU)
              </span>
              <Button type="button" variant="outline" size="sm" onClick={addVariantRow}>
                + Add Variant
              </Button>
            </div>

            <div className="space-y-2">
              {variantsList.map((v, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={v.size}
                    onChange={(e) => updateVariantRow(idx, 'size', e.target.value)}
                    placeholder="Size (34B)"
                    className="col-span-3 text-xs h-9 px-2 border rounded-sm"
                  />
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => updateVariantRow(idx, 'color', e.target.value)}
                    placeholder="Color (Dusty Rose)"
                    className="col-span-3 text-xs h-9 px-2 border rounded-sm"
                  />
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateVariantRow(idx, 'stock', e.target.value)}
                    placeholder="Stock"
                    className="col-span-2 text-xs h-9 px-2 border rounded-sm"
                  />
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => updateVariantRow(idx, 'sku', e.target.value)}
                    placeholder="SKU"
                    className="col-span-3 text-xs h-9 px-2 border rounded-sm font-mono text-[10px]"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariantRow(idx)}
                    className="col-span-1 text-red-500 hover:text-red-700 p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-charcoal-200">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? 'Save Updates' : 'Publish Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
