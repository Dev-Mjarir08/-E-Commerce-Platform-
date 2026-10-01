import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      default: 'General Luxury'
    },
    description: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

brandSchema.index({ status: 1 });

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
