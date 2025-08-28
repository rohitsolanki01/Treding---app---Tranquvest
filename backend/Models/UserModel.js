const {  mongoose, model } = require("mongoose");
const userSchema = require("../Schemas/User")

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

const User = mongoose.model("User",userSchema);

 module.exports = User;


