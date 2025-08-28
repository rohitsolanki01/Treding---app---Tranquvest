const { Schema } = require("mongoose");

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  mode: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'executed', 'cancelled'],
    default: 'executed'
  },
  totalValue: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ✅ FIX: Enhanced pre-save hook
OrderSchema.pre('save', function(next) {
  console.log('🔧 Pre-save hook triggered');
  console.log('📊 Document before save:', {
    qty: this.qty,
    price: this.price,
    totalValue: this.totalValue
  });
  
  // Always calculate totalValue
  this.totalValue = this.qty * this.price;
  
  console.log('✅ totalValue calculated:', this.totalValue);
  next();
});

module.exports = OrderSchema;
