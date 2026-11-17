import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g., '32B', '34C', '36D', 'S', 'M', 'L'
  color: { type: String, required: true }, // e.g., 'Ivory Pearl', 'Dusty Rose', 'Midnight Noir', 'Burgundy Velvet'
  colorHex: { type: String, default: '#F7F2EE' },
  stock: { type: Number, required: true, default: 0, min: 0 },
  sku: { type: String, required: true },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
  public_id: { type: String, default: '' },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    details: [
      {
        title: { type: String },
        content: { type: String },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    categoryName: {
      type: String,
      default: '',
    },
    images: [imageSchema],
    fabric: {
      type: String,
      required: [true, 'Fabric composition is required'],
      default: 'Silk & Fine French Lace',
    },
    careInstructions: {
      type: String,
      default: 'Hand wash cold in mild silk detergent. Lay flat to dry away from direct sunlight. Do not tumble dry.',
    },
    variants: [variantSchema],
    price: {
      type: Number,
      required: [true, 'Product price in PKR is required'],
      min: 0,
    },
    comparePrice: {
      type: Number,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate total stock
productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
