import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: { type: String, required: true },
  image: { type: String, required: true },
  variant: {
    size: { type: String, required: true },
    color: { type: String, required: true },
    sku: { type: String, default: '' },
  },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  recipientName: { type: String, required: true },
  phone: { type: String, required: true },
  streetAddress: { type: String, required: true },
  apartment: { type: String, default: '' },
  city: { type: String, required: true },
  postalCode: { type: String, default: '' },
  country: { type: String, default: 'Pakistan' },
  discreetPackagingRequested: { type: Boolean, default: true },
  deliveryNotes: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Supports guest checkout
    },
    guestInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'JazzCash', 'Easypaisa', 'Bank Transfer'],
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
      default: 'Pending',
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    shipping: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    couponCode: {
      type: String,
      default: null,
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    courierName: {
      type: String,
      default: 'TCS Luxury Express',
    },
    isCodFlaggedForConfirmation: {
      type: Boolean,
      default: true, // Pakistan standard for luxury COD: call verification
    },
    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-generate order number before validate
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `VP-${new Date().getFullYear()}-${randomSuffix}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
