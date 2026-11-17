import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/useCartStore';
import { ShieldCheck, Check, AlertCircle } from 'lucide-react';

export const QuickAddModal = ({ isOpen, onClose, product }) => {
  const { addItem } = useCartStore();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product && product.variants?.length > 0) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
      setQty(1);
    }
  }, [product]);

  if (!product) return null;

  // Unique colors
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  // Sizes available for selected color
  const availableVariants = product.variants.filter((v) => v.color === selectedColor);
  const currentVariant = availableVariants.find((v) => v.size === selectedSize) || availableVariants[0];

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addItem(product, currentVariant, qty);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Your Size & Color" maxWidth="max-w-md">
      <div className="space-y-5">
        {/* Product mini header */}
        <div className="flex space-x-4">
          <img
            src={product.images?.[0]?.url}
            alt={product.title}
            className="w-20 h-24 object-cover rounded-sm border border-charcoal-200/60"
          />
          <div className="flex-1">
            <h4 className="font-serif text-lg text-charcoal-900 leading-snug">{product.title}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className="font-medium text-sm text-charcoal-900">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-xs text-charcoal-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-charcoal-500 mt-1">{product.fabric}</p>
          </div>
        </div>

        {/* Color Swatches */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-700 mb-2">
            Color: <span className="font-normal text-charcoal-900">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((colorName) => {
              const variantSample = product.variants.find((v) => v.color === colorName);
              const hex = variantSample?.colorHex || '#1C1A19';
              const isSelected = selectedColor === colorName;

              return (
                <button
                  key={colorName}
                  onClick={() => {
                    setSelectedColor(colorName);
                    const firstSizeForColor = product.variants.find((v) => v.color === colorName)?.size;
                    if (firstSizeForColor) setSelectedSize(firstSizeForColor);
                  }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm border text-xs transition-all ${
                    isSelected
                      ? 'border-charcoal-900 bg-charcoal-900 text-ivory-50 font-medium'
                      : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-charcoal-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{colorName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-700">
              Select Size:
            </label>
            <span className="text-[11px] text-rose-deep underline cursor-pointer">Size Guide</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {availableVariants.map((v) => {
              const isSelected = selectedSize === v.size;
              const isOutOfStock = v.stock <= 0;

              return (
                <button
                  key={v.size}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(v.size)}
                  className={`py-2 text-xs font-medium rounded-sm border transition-all text-center relative ${
                    isSelected
                      ? 'border-charcoal-900 bg-charcoal-900 text-ivory-50'
                      : isOutOfStock
                      ? 'border-charcoal-200 bg-charcoal-100/50 text-charcoal-300 line-through cursor-not-allowed'
                      : 'border-charcoal-200 bg-white text-charcoal-800 hover:border-charcoal-900'
                  }`}
                >
                  {v.size}
                  {v.stock > 0 && v.stock <= 3 && !isSelected && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-deep" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock status notice */}
        {currentVariant && currentVariant.stock > 0 && currentVariant.stock <= 3 && (
          <div className="flex items-center space-x-1.5 text-xs text-rose-deep bg-rose-light/70 p-2.5 rounded-sm border border-rose-accent/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Only {currentVariant.stock} pieces remaining in stock for this variant.</span>
          </div>
        )}

        {/* Add button */}
        <div className="pt-2">
          <Button
            onClick={handleAddToCart}
            disabled={!currentVariant || currentVariant.stock <= 0}
            className="w-full"
            size="lg"
          >
            {currentVariant && currentVariant.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
          </Button>

          <div className="mt-3 flex items-center justify-center space-x-1.5 text-[11px] text-charcoal-500">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-vip" />
            <span>100% Discreet Packaging Guaranteed</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
