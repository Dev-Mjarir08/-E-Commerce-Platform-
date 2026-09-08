import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
      default: null
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store reference is required']
    },
    changeType: {
      type: String,
      required: true,
      enum: ['restock', 'sale', 'cancellation', 'return', 'adjustment', 'damaged']
    },
    quantityChanged: {
      type: Number,
      required: true
    },
    previousStock: {
      type: Number,
      required: true
    },
    newStock: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      trim: true,
      default: ''
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

inventoryLogSchema.index({ product: 1 });
inventoryLogSchema.index({ store: 1 });
inventoryLogSchema.index({ createdAt: -1 });

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);
export default InventoryLog;
