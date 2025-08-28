const {  mongoose } = require("mongoose");
const resisterUserSchema = require("../Schemas/ResisterUser");

const ResisterUserModel = mongoose.model("resisterUser", resisterUserSchema);

module.exports = ResisterUserModel;
