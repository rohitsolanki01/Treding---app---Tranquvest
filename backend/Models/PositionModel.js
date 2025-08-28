const PositionSchema = require("../Schemas/Positions");
const mongoose = require("mongoose");
const Position = mongoose.model('Position', PositionSchema);
module.exports = Position;
