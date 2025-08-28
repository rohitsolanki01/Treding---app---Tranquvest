const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const upload = require('../uploade');
const fs = require('fs').promises;

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      provider: user.provider 
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" } // Extended to 24 hours
  );
};

// Helper function to format user response
const formatUserResponse = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  provider: user.provider,
  picture: user.picture,
  isEmailVerified: user.isEmailVerified,
  lastLogin: user.lastLogin
});

// Register User (local)
module.exports.registerController = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.provider === "google") {
        return res.status(400).json({ 
          message: "Email already registered with Google. Please use Google login.",
          suggestion: "google_login"
        });
      } else {
        return res.status(400).json({ 
          message: "User already exists with this email" 
        });
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      provider: "local",
      lastLogin: new Date()
    });

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({ 
      message: "Registration successful", 
      token,
      user: formatUserResponse(newUser)
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Login User (local)
module.exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    // Check provider
    if (user.provider === "google") {
      return res.status(400).json({ 
        message: "This email is registered with Google. Please use Google login.",
        suggestion: "google_login"
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.json({ 
      message: "Login successful", 
      token, 
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Login failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Google Login
module.exports.googleLoginController = async (req, res) => {
  try {
    const { token } = req.body;
        
    if (!token) {
      return res.status(400).json({ 
        message: "Google token is required" 
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub, picture, email_verified } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new Google user
      user = await User.create({
        email,
        name,
        provider: "google",
        googleId: sub,
        picture: picture,
        isEmailVerified: email_verified || false,
        lastLogin: new Date()
      });
    } else {
      // Update existing user
      if (user.provider === "local") {
        // Link Google account to existing local account
        user.googleId = sub;
        user.picture = picture;
        user.isEmailVerified = email_verified || user.isEmailVerified;
      }
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT
    const jwtToken = generateToken(user);

    res.json({
      message: "Google login successful",
      token: jwtToken,
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({
      message: "Google login failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Get current user profile
module.exports.getProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile retrieved successfully",
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ 
      message: "Failed to fetch profile" 
    });
  }
};

// Logout (optional - mainly for token blacklisting in production)
module.exports.logoutController = async (req, res) => {
  try {
    // In a production app, you'd want to blacklist the token
    // For now, we'll just send a success response
    res.json({ 
      message: "Logout successful" 
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ 
      message: "Logout failed" 
    });
  }
};


// Update user profile
module.exports.updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, address, bio } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        message: "Name and email are required" 
      });
    }

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ 
          message: "Email is already taken by another user" 
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        dateOfBirth: dateOfBirth || null,
        address: address?.trim() || null,
        bio: bio?.trim() || null,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: "Profile updated successfully",
      user: formatUserResponse(updatedUser)
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ 
      message: "Failed to update profile",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Change password
module.exports.changePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters long" 
      });
    }

    const user = await User.findById(userId);
    
    if (user.provider === "google") {
      return res.status(400).json({ 
        message: "Cannot change password for Google accounts" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(userId, { 
      password: hashedNewPassword,
      updatedAt: new Date()
    });

    res.json({ 
      message: "Password changed successfully" 
    });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ 
      message: "Failed to change password",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Delete account
module.exports.deleteAccountController = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    // For local users, verify password
    if (user.provider === "local") {
      if (!password) {
        return res.status(400).json({ 
          message: "Password is required to delete account" 
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ 
          message: "Password is incorrect" 
        });
      }
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({ 
      message: "Account deleted successfully" 
    });
  } catch (err) {
    console.error("Account deletion error:", err);
    res.status(500).json({ 
      message: "Failed to delete account",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};



// Upload profile picture
module.exports.uploadProfilePictureController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: "No image file provided" 
      });
    }

    const userId = req.user.id;
    let imageUrl;

    // For Cloudinary
    if (req.file.path) {
      imageUrl = req.file.path; // Cloudinary URL
    } else {
      // For local storage
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/profile-images/${req.file.filename}`;
    }

    // Delete old profile picture if it exists and it's not a Google profile picture
    const user = await User.findById(userId);
    if (user.picture && !user.picture.includes('googleusercontent.com') && !user.picture.includes('cloudinary.com')) {
      try {
        // Extract filename from URL for local storage
        const oldFilename = user.picture.split('/').pop();
        const oldFilePath = `uploads/profile-images/${oldFilename}`;
        await fs.unlink(oldFilePath);
      } catch (deleteError) {
        console.log('Could not delete old profile picture:', deleteError.message);
      }
    }

    // Update user profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        picture: imageUrl,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    res.json({
      message: "Profile picture updated successfully",
      user: formatUserResponse(updatedUser),
      imageUrl: imageUrl
    });
  } catch (err) {
    console.error("Profile picture upload error:", err);
    res.status(500).json({ 
      message: "Failed to upload profile picture",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Delete profile picture
module.exports.deleteProfilePictureController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.picture) {
      return res.status(400).json({ 
        message: "No profile picture to delete" 
      });
    }

    // Don't delete Google profile pictures
    if (user.picture.includes('googleusercontent.com')) {
      return res.status(400).json({ 
        message: "Cannot delete Google profile picture" 
      });
    }

    // Delete file from local storage
    if (!user.picture.includes('cloudinary.com')) {
      try {
        const filename = user.picture.split('/').pop();
        const filePath = `uploads/profile-images/${filename}`;
        await fs.unlink(filePath);
      } catch (deleteError) {
        console.log('Could not delete profile picture file:', deleteError.message);
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        picture: null,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    res.json({
      message: "Profile picture deleted successfully",
      user: formatUserResponse(updatedUser)
    });
  } catch (err) {
    console.error("Profile picture deletion error:", err);
    res.status(500).json({ 
      message: "Failed to delete profile picture",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};