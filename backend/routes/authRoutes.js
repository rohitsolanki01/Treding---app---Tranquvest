const express = require("express");
const upload = require('../uploade');
const { 
  registerController, 
  loginController, 
  googleLoginController,
  getProfileController,
  logoutController,
  updateProfileController,
  changePasswordController,
  deleteAccountController,
  uploadProfilePictureController,
  deleteProfilePictureController
} = require("../controller/authController");
const authenticateToken = require("../uthMiddleware");
const router = express.Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google", googleLoginController);

// Protected routes
router.get("/profile", authenticateToken, getProfileController);
router.put("/profile", authenticateToken, updateProfileController);
router.put("/change-password", authenticateToken, changePasswordController);
router.delete("/account", authenticateToken, deleteAccountController);
router.post("/logout", authenticateToken, logoutController);

// Profile picture routes
router.post("/upload-picture", authenticateToken, upload.single('profilePicture'), uploadProfilePictureController);
router.delete("/profile-picture", authenticateToken, deleteProfilePictureController);

module.exports = router;
