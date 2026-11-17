import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
      default: 'percentage',
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrder: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isVipOnly: {
      type: Boolean,
      default: false,
    },
    allowedTiers: [
      {
        type: String,
        enum: ['Silver', 'Rose Gold', 'Black Card'],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check validity
couponSchema.methods.isValid = function (subtotal, userTier = 'Silver') {
  if (!this.isActive) return { valid: false, reason: 'This coupon is no longer active.' };
  if (this.expiresAt && new Date() > this.expiresAt) return { valid: false, reason: 'This coupon has expired.' };
  if (this.usedCount >= this.usageLimit) return { valid: false, reason: 'This coupon usage limit has been reached.' };
  if (subtotal < this.minOrder) return { valid: false, reason: `Minimum order amount of PKR ${this.minOrder.toLocaleString()} required.` };
  
  if (this.isVipOnly) {
    if (userTier === 'Silver') {
      return { valid: false, reason: 'This is an exclusive VIP coupon for Rose Gold & Black Card members.' };
    }
    if (this.allowedTiers && this.allowedTiers.length > 0 && !this.allowedTiers.includes(userTier)) {
      return { valid: false, reason: `Exclusive to ${this.allowedTiers.join(' & ')} VIP tiers.` };
    }
  }

  return { valid: true };
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
