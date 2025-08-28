const jwt = require("jsonwebtoken");
const User = require("./Models/UserModel");

const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware called');
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ 
        message: "Access denied. No token provided." 
      });
    }

    console.log('🔍 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', { id: decoded.id });
    
    // Verify user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('❌ User not found for token');
      return res.status(401).json({ 
        message: "Invalid token. User not found." 
      });
    }

    // ✅ FIX: Set both req.user and req.userId
    req.user = user;
    req.userId = user._id; // ✅ ADD: This was missing and causing the validation error
    
    console.log('✅ Auth successful, userId:', req.userId);
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    res.status(403).json({ 
      message: "Invalid token" 
    });
  }
};

module.exports = authenticateToken;
