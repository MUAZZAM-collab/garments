import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    badgeText: {
      type: String,
      default: 'NEW COLLECTION',
    },
    ctaText: {
      type: String,
      default: 'Explore Collection',
    },
    ctaLink: {
      type: String,
      default: '/shop',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    overlayOpacity: {
      type: Number,
      default: 20, // 20%
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
