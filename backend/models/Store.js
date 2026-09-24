import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Store owner is required']
    },
    name: {
      type: String,
      required: [true, 'Store name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Store name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    logo: {
      public_id: { type: String, default: null },
      url: { type: String, default: null }
    },
    banner: {
      public_id: { type: String, default: null },
      url: { type: String, default: null }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    website: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'General'
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'closed'],
      default: 'pending'
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    settings: {
      // Banking & Payouts
      payoutMethod: {
        type: String,
        enum: ['bank', 'paypal'],
        default: 'bank'
      },
      bankName: {
        type: String,
        default: ''
      },
      accountHolder: {
        type: String,
        default: ''
      },
      accountNumber: {
        type: String,
        default: ''
      },
      routingNumber: {
        type: String,
        default: ''
      },
      paypalEmail: {
        type: String,
        default: ''
      },
      payoutSchedule: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
        default: 'Weekly'
      },

      // Tax & Compliance
      taxId: {
        type: String,
        default: ''
      },
      businessType: {
        type: String,
        default: 'LLC'
      },
      collectTax: {
        type: Boolean,
        default: true
      },
      defaultTaxRate: {
        type: String,
        default: '8.25'
      },

      // Fulfillment & Shipping Defaults
      freeShippingThreshold: {
        type: String,
        default: '75.00'
      },
      processingTime: {
        type: String,
        default: '1-2 Business Days'
      },
      autoFulfillDigital: {
        type: Boolean,
        default: true
      },
      enableLocalPickup: {
        type: Boolean,
        default: false
      },

      // Store Notifications
      orderEmailAlerts: {
        type: Boolean,
        default: true
      },
      lowStockAlerts: {
        type: Boolean,
        default: true
      },
      lowStockThreshold: {
        type: String,
        default: '5'
      },
      customerSmsAlerts: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true
  }
);

storeSchema.index({ owner: 1 });

const Store = mongoose.model('Store', storeSchema);
export default Store;
