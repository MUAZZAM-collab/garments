import { create } from 'zustand';
import api from '../services/api';

const FREE_SHIPPING_THRESHOLD = 3500;
const STANDARD_SHIPPING_FEE = 250;

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem('veloura_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const getInitialCoupon = () => {
  try {
    const saved = localStorage.getItem('veloura_coupon');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),
  isDrawerOpen: false,
  selectedCity: 'Karachi',
  appliedCoupon: getInitialCoupon(),
  couponError: null,
  isApplyingCoupon: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  setSelectedCity: (city) => set({ selectedCity: city }),

  // Add item with variant
  addItem: (product, variant, qty = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.variant.size === variant.size &&
          item.variant.color === variant.color
      );

      let newItems;
      if (existingIndex > -1) {
        newItems = [...state.items];
        newItems[existingIndex].qty += qty;
      } else {
        newItems = [
          ...state.items,
          {
            product: {
              _id: product._id,
              title: product.title,
              slug: product.slug,
              price: product.price,
              comparePrice: product.comparePrice,
              image: product.images?.[0]?.url || '',
              fabric: product.fabric,
            },
            variant: {
              size: variant.size,
              color: variant.color,
              colorHex: variant.colorHex,
              stock: variant.stock,
              sku: variant.sku,
            },
            qty,
          },
        ];
      }

      localStorage.setItem('veloura_cart', JSON.stringify(newItems));
      return { items: newItems, isDrawerOpen: true };
    });
  },

  updateQuantity: (index, qty) => {
    set((state) => {
      if (qty <= 0) {
        return get().removeItem(index);
      }
      const newItems = [...state.items];
      newItems[index].qty = qty;
      localStorage.setItem('veloura_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (index) => {
    set((state) => {
      const newItems = state.items.filter((_, i) => i !== index);
      localStorage.setItem('veloura_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem('veloura_cart');
    localStorage.removeItem('veloura_coupon');
    set({ items: [], appliedCoupon: null, couponError: null });
  },

  // Apply Coupon
  applyCoupon: async (code) => {
    try {
      set({ isApplyingCoupon: true, couponError: null });
      const subtotal = get().getSubtotal();
      const res = await api.post('/coupons/validate', { code, subtotal });
      
      const couponData = {
        code: res.coupon.code,
        discount: res.coupon.discount,
        type: res.coupon.type,
        value: res.coupon.value,
      };

      localStorage.setItem('veloura_coupon', JSON.stringify(couponData));
      set({ appliedCoupon: couponData, isApplyingCoupon: false, couponError: null });
      return { success: true, coupon: couponData };
    } catch (err) {
      set({ isApplyingCoupon: false, couponError: err.message });
      return { success: false, message: err.message };
    }
  },

  removeCoupon: () => {
    localStorage.removeItem('veloura_coupon');
    set({ appliedCoupon: null, couponError: null });
  },

  // Calculations
  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  },

  getItemCount: () => {
    return get().items.reduce((acc, item) => acc + item.qty, 0);
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  },

  getFreeShippingRemaining: () => {
    const subtotal = get().getSubtotal();
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  },

  getFreeShippingProgress: () => {
    const subtotal = get().getSubtotal();
    return Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  },

  getDiscount: () => {
    const coupon = get().appliedCoupon;
    if (!coupon) return 0;
    const subtotal = get().getSubtotal();
    if (coupon.type === 'percentage') {
      return Math.round((subtotal * coupon.value) / 100);
    }
    return Math.min(subtotal, coupon.value);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const shipping = get().getShippingFee();
    const discount = get().getDiscount();
    return Math.max(0, subtotal + shipping - discount);
  },
}));
