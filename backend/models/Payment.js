import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order reference is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['stripe', 'paypal', 'cod', 'wallet']
    },
    transactionId: {
      type: String,
      trim: true,
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending'
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
