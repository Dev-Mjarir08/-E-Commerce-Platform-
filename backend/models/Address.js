import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    apartment: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State/Province is required'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'US'
    },
    addressType: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    isDefaultShipping: {
      type: Boolean,
      default: false
    },
    isDefaultBilling: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

addressSchema.index({ user: 1 });

const Address = mongoose.model('Address', addressSchema);
export default Address;
