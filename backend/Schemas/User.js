const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === "local";
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // New profile fields
  phone: {
    type: String,
    trim: true,
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  address: {
    type: String,
    trim: true,
    default: null
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light"
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      trading: { type: Boolean, default: true }
    },
    privacy: {
      profilePublic: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false }
    }
  }
}, { 
  timestamps: true 
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ provider: 1 });

module.exports = userSchema;
