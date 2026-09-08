import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    },
    title: {
      type: String,
      required: [true, 'Variant title is required'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'Variant SKU is required'],
      unique: true,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Variant price is required'],
      min: [0, 'Price cannot be negative']
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      default: null
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    images: [
      {
        public_id: { type: String, default: null },
        url: { type: String, required: true }
      }
    ],
    attributes: [
      {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

productVariantSchema.index({ product: 1 });
productVariantSchema.index({ sku: 1 });

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
export default ProductVariant;
