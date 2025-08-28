const  OrderSchema = require("../Schemas/Order");
const mongoose = require("mongoose");

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
