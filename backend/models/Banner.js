import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ''
    },
    placement: {
      type: String,
      enum: ['Homepage Hero', 'Homepage Slider', 'Category Banner', 'Promotional Strip', 'Sidebar Banner'],
      default: 'Homepage Hero'
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'scheduled', 'archived'],
      default: 'published'
    },
    position: {
      type: Number,
      default: 1
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    clicks: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '/shop'
    },
    targetAudience: {
      type: String,
      default: 'all'
    }
  },
  { timestamps: true }
);

bannerSchema.index({ placement: 1, status: 1, position: 1 });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
