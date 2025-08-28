const { Schema } = require("mongoose");

const PositionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // instrument identity
  symbol: { type: String, required: true, uppercase: true },
  name:   { type: String },
  exchange: { type: String, default: 'NSE' },

  // product and type
  productType: { type: String, enum: ['MIS','CNC','NRML'], required: true }, // intraday/delivery
  instrumentType: { type: String, enum: ['EQ','FUT','OPT'], default: 'EQ' },

  // directional exposure
  side: { type: String, enum: ['LONG','SHORT'], required: true },

  // sizes and prices
  buyQty:  { type: Number, default: 0 },
  sellQty: { type: Number, default: 0 },
  netQty:  { type: Number, default: 0 },

  avgBuyPrice:  { type: Number, default: 0 },
  avgSellPrice: { type: Number, default: 0 },
  netAvgPrice:  { type: Number, default: 0 },  // VWAP of open leg
  lastPrice:    { type: Number, default: 0 },  // mark/LTP used for unrealized

  // P&L and costs
  realizedPnl:    { type: Number, default: 0 },
  unrealizedPnl:  { type: Number, default: 0 },
  pnlPercent:     { type: Number, default: 0 },
  fees:           { type: Number, default: 0 },
  taxes:          { type: Number, default: 0 },
  breakEvenPrice: { type: Number, default: 0 },

  // derivatives metadata
  optionType: { type: String, enum: ['CE','PE', null], default: null },
  strikePrice: { type: Number, default: 0 },
  expiry: { type: Date },
  lotSize: { type: Number, default: 0 },
  contractMultiplier: { type: Number, default: 1 },
  marginRequired: { type: Number, default: 0 },

  // lifecycle
  positionStatus: { type: String, enum: ['OPEN','CLOSED'], default: 'OPEN' },
  entryTime: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = PositionSchema;
