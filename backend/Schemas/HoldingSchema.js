const { Schema } = require("mongoose");

const HoldingsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  totalQty: {
    type: Number,
    default: 0
  },
  avgPrice: {
    type: Number,
    default: 0
  },
  totalInvested: {
    type: Number,
    default: 0
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  marketValue: {
    type: Number,
    default: 0
  },
  pnl: {
    type: Number,
    default: 0
  },
  pnlPercent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = HoldingsSchema;
