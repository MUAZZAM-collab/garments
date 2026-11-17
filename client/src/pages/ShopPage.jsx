import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'new';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const selectedFabric = searchParams.get('fabric') || '';
  const selectedTag = searchParams.get('tag') || '';
  const searchQuery = searchParams.get('search') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Local price slider state
  const [priceRange, setPriceRange] = useState(maxPrice || 20000);

  // Filter options
  const sizeOptions = ['32B', '34B', '34C', '36B', '36C', '38C', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = [
    { name: 'Dusty Rose', hex: '#B76E79' },
    { name: 'Midnight Noir', hex: '#1C1A19' },
    { name: 'Warm Ivory', hex: '#F7F2EE' },
    { name: 'Deep Berry', hex: '#7B3F4C' },
    { name: 'Champagne Silk', hex: '#F4ECE0' },
  ];
  const fabricOptions = ['Mulberry Silk', 'French Chantilly Lace', 'Micro-Modal', 'PowerSlim®'];

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res?.categories) setCategories(res.categories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const query = new URLSearchParams(searchParams);
        const res = await api.get(`/products?${query.toString()}`);
        if (res?.products) {
          setProducts(res.products);
          setTotalCount(res.totalCount);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange(20000);
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedSize,
    selectedColor,
    selectedFabric,
    selectedTag,
    searchQuery,
    inStockOnly ? 'inStock' : '',
    maxPrice ? 'price' : '',
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header & Breadcrumb */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-rose-deep font-semibold">
          The Full Atelier Portfolio
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 font-normal">
          {selectedCategory ? `${selectedCategory.toUpperCase()} COLLECTION` : 'All Lingerie & Silk'}
        </h1>
        <p className="text-xs text-charcoal-600 font-normal">
          Exquisite undergarments and nightwear designed for confident comfort and discreet elegance.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-charcoal-200/60 pb-4 mb-8 gap-4">
        {/* Mobile filter button & result count */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-3.5 py-2 border border-charcoal-200 rounded-sm text-xs font-medium uppercase tracking-wider bg-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          <span className="text-xs text-charcoal-500">
            Showing <strong className="text-charcoal-900">{totalCount}</strong> pieces
          </span>
        </div>

        {/* Active filter pills */}
        {activeFiltersCount > 0 && (
          <div className="hidden md:flex flex-wrap items-center gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-charcoal-200 rounded-sm text-[11px] text-charcoal-700">
                <span>Category: {selectedCategory}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('category', '')} />
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-charcoal-200 rounded-sm text-[11px] text-charcoal-700">
                <span>Size: {selectedSize}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('size', '')} />
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-charcoal-200 rounded-sm text-[11px] text-charcoal-700">
                <span>Color: {selectedColor}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('color', '')} />
              </span>
            )}
            {maxPrice && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-charcoal-200 rounded-sm text-[11px] text-charcoal-700">
                <span>Up to {formatPrice(maxPrice)}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('maxPrice', '')} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-rose-deep hover:underline uppercase tracking-wider font-semibold ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs text-charcoal-500 uppercase tracking-wider hidden sm:inline">
            Sort by:
          </label>
          <select
            value={selectedSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="text-xs font-medium border border-charcoal-200 rounded-sm py-2 px-3 bg-white focus:outline-none focus:border-charcoal-900"
          >
            <option value="new">Newest Additions</option>
            <option value="bestseller">Bestselling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sticky Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-28 self-start max-h-[80vh] overflow-y-auto pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-200">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 tracking-wide">
              Filter Selection
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-deep hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700">
              Category
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => updateFilter('category', '')}
                className={`block w-full text-left py-1 hover:text-rose-accent transition-colors ${
                  !selectedCategory ? 'font-bold text-rose-deep' : 'text-charcoal-600'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`block w-full text-left py-1 hover:text-rose-accent transition-colors ${
                    selectedCategory === cat.slug ? 'font-bold text-rose-deep' : 'text-charcoal-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2 pt-2 border-t border-charcoal-200/60">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700">
              Size
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {sizeOptions.map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateFilter('size', selectedSize === sz ? '' : sz)}
                  className={`py-1.5 px-2 text-xs rounded-sm border transition-all text-center ${
                    selectedSize === sz
                      ? 'border-charcoal-900 bg-charcoal-900 text-ivory-50 font-medium'
                      : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-charcoal-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2 pt-2 border-t border-charcoal-200/60">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700">
              Color Palette
            </h4>
            <div className="space-y-1.5">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => updateFilter('color', selectedColor === c.name ? '' : c.name)}
                  className={`flex items-center space-x-2 text-xs w-full py-1 text-left ${
                    selectedColor === c.name ? 'font-bold text-rose-deep' : 'text-charcoal-600'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/15 flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fabric */}
          <div className="space-y-2 pt-2 border-t border-charcoal-200/60">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700">
              Fabric
            </h4>
            <div className="space-y-1 text-xs">
              {fabricOptions.map((fab) => (
                <button
                  key={fab}
                  onClick={() => updateFilter('fabric', selectedFabric === fab ? '' : fab)}
                  className={`block w-full text-left py-1 ${
                    selectedFabric === fab ? 'font-bold text-rose-deep' : 'text-charcoal-600'
                  }`}
                >
                  {fab}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-charcoal-200/60">
            <div className="flex justify-between items-center text-xs">
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700">
                Max Price:
              </h4>
              <span className="font-semibold text-charcoal-900">{formatPrice(priceRange)}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="20000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              onMouseUp={() => updateFilter('maxPrice', priceRange)}
              onTouchEnd={() => updateFilter('maxPrice', priceRange)}
              className="w-full accent-charcoal-900 cursor-pointer"
            />
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-charcoal-200/60">
            <label className="flex items-center space-x-2 text-xs text-charcoal-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                className="rounded border-charcoal-300 text-charcoal-900 focus:ring-charcoal-900"
              />
              <span>In-stock pieces only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="space-y-2">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-white rounded-sm border border-charcoal-200/50 p-8">
              <p className="font-serif text-3xl text-charcoal-400 italic">No pieces found</p>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                No designs match your active filter criteria. Try adjusting your selections or view the complete atelier.
              </p>
              <Button onClick={clearAllFilters} variant="primary" size="default">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over Bottom Sheet / Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative z-10 bg-white rounded-t-xl p-6 max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-charcoal-200 pb-3">
              <h3 className="font-serif text-xl font-semibold">Refine Collection</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="h-5 w-5 text-charcoal-500" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Category</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`px-3 py-1.5 rounded-sm border text-xs ${!selectedCategory ? 'bg-charcoal-900 text-white' : 'bg-ivory-50'}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => updateFilter('category', c.slug)}
                    className={`px-3 py-1.5 rounded-sm border text-xs ${selectedCategory === c.slug ? 'bg-charcoal-900 text-white' : 'bg-ivory-50'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sizes */}
            <div className="space-y-2 pt-2 border-t border-charcoal-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Size</h4>
              <div className="grid grid-cols-4 gap-2">
                {sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateFilter('size', selectedSize === sz ? '' : sz)}
                    className={`py-2 text-xs rounded-sm border text-center ${selectedSize === sz ? 'bg-charcoal-900 text-white font-medium' : 'bg-white'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={clearAllFilters}
                className="flex-1"
              >
                Reset All
              </Button>
              <Button
                variant="primary"
                size="default"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
