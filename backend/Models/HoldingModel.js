const HoldingsSchema = require("../Schemas/HoldingSchema");
const mongoose = require("mongoose");

const Holdings = mongoose.model('Holdings', HoldingsSchema);

module.exports = Holdings;
