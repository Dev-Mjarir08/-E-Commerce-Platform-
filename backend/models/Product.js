import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store reference is required']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required']
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    brand: {
      type: String,
      trim: true,
      default: ''
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Base price cannot be negative']
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      default: null,
      validate: {
        validator: function (val) {
          return val == null || val <= this.basePrice;
        },
        message: 'Discount price must be less than or equal to base price'
      }
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    hasVariants: {
      type: Boolean,
      default: false
    },
    images: [
      {
        public_id: { type: String, default: null },
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false }
      }
    ],
    attributes: [
      {
        name: { type: String, trim: true },
        value: { type: String, trim: true }
      }
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ slug: 1 });
productSchema.index({ store: 1 });
productSchema.index({ category: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ ratingsAverage: -1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
