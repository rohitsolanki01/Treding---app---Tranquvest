import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../config/axios';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [forceRefresh, setForceRefresh] = useState(0); // ✅ ADD: Force component refresh
  const fileInputRef = useRef(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    bio: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deletePassword, setDeletePassword] = useState('');

  // Initialize profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: user.address || '',
        bio: user.bio || ''
      });
      
      setImageKey(Date.now());
    }
  }, [user]);

  // Handle profile image upload - ✅ ENHANCED FOR GOOGLE ACCOUNTS
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and GIF images are allowed');
      return;
    }

    setImageUploading(true);
    setImageLoading(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      console.log('🔄 Uploading profile picture for Google user...');

      const response = await axiosInstance.post('/api/auth/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload response:', response.data);

      // ✅ ENHANCED: Force immediate update with aggressive cache-busting
      const timestamp = new Date().getTime();
      const newImageUrl = response.data.user.picture;
      
      const updatedUser = {
        ...response.data.user,
        picture: `${newImageUrl}?v=${timestamp}&refresh=${Math.random()}` // Double cache busting
      };

      // ✅ ENHANCED: Multiple update strategies
      updateUser(updatedUser);
      setImageKey(timestamp);
      setForceRefresh(prev => prev + 1); // Force component refresh
      
      // ✅ ENHANCED: Aggressive cache clearing for Google images
      setTimeout(() => {
        // Clear all cached profile images
        const allImages = document.querySelectorAll('img[alt*="profile"], img[alt*="Profile"], img[src*="googleusercontent.com"]');
        allImages.forEach(img => {
          const originalSrc = img.src.split('?')[0];
          img.src = `${originalSrc}?v=${timestamp}&r=${Math.random()}`;
          
          // Force reload by removing and re-adding src
          const tempSrc = img.src;
          img.src = '';
          setTimeout(() => {
            img.src = tempSrc;
          }, 10);
        });
        
        // ✅ ENHANCED: Force browser cache refresh for Google users
        if (user?.provider === 'google') {
          // Create a temporary image to preload the new image
          const preloadImg = new Image();
          preloadImg.onload = () => {
            console.log('✅ New profile image preloaded successfully');
            setImageLoading(false);
          };
          preloadImg.src = `${newImageUrl}?v=${timestamp}&preload=${Math.random()}`;
        }
      }, 100);

      // ✅ ENHANCED: Additional refresh for Google accounts
      if (user?.provider === 'google') {
        setTimeout(() => {
          setForceRefresh(prev => prev + 1);
        }, 1000);
      }

      toast.success('Profile picture updated successfully! 🎉');
      console.log('✅ Google profile picture override successful');
    } catch (error) {
      console.error('❌ Image upload error:', error);
      const message = error.response?.data?.message || 'Failed to upload image';
      toast.error(message);
    } finally {
      setImageUploading(false);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle profile image deletion - ENHANCED
  const handleImageDelete = async () => {
    if (!user || !user.picture) return;

    if (user.picture.includes('googleusercontent.com') && !user.customPicture) {
      toast.error('Cannot delete original Google profile picture');
      return;
    }

    setImageUploading(true);
    setImageLoading(true);

    try {
      const response = await axiosInstance.delete('/api/auth/profile-picture');
      
      const timestamp = new Date().getTime();
      const updatedUser = {
        ...response.data.user,
        picture: null
      };
      
      updateUser(updatedUser);
      setImageKey(timestamp);
      setForceRefresh(prev => prev + 1);
      
      toast.success('Profile picture deleted successfully!');
    } catch (error) {
      console.error('Image deletion error:', error);
      const message = error.response?.data?.message || 'Failed to delete image';
      toast.error(message);
    } finally {
      setImageUploading(false);
      setImageLoading(false);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.put('/api/auth/profile', profileData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Password change error:', error);
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      await axiosInstance.delete('/api/auth/account', {
        data: { password: deletePassword }
      });

      toast.success('Account deleted successfully');
      
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      console.error('Account deletion error:', error);
      const message = error.response?.data?.message || 'Failed to delete account';
      toast.error(message);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeletePassword('');
    }
  };

  const isGoogleUser = user?.provider === 'google';

  // ✅ ENHANCED: Generate image source with aggressive cache busting for Google
  const getImageSrc = () => {
    if (!user || !user.picture) return null;
    
    const baseUrl = user.picture.split('?')[0];
    const cacheBuster = `v=${imageKey}&f=${forceRefresh}&t=${Date.now()}`;
    
    // ✅ ENHANCED: Special handling for Google images
    if (user.picture.includes('googleusercontent.com')) {
      return `${baseUrl}?${cacheBuster}&size=120`; // Google image size parameter
    }
    
    return `${baseUrl}?${cacheBuster}`;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {user && user.picture ? (
              <img 
                src={getImageSrc()}
                alt={`${user.name} profile picture`}
                referrerPolicy="no-referrer"
                key={`profile-img-${imageKey}-${forceRefresh}`} // ✅ ENHANCED: Double key for forcing refresh
                className={`profile-image ${imageLoading ? 'image-loading' : ''}`}
                crossOrigin="anonymous" // ✅ ADD: Help with CORS for Google images
                onLoad={() => {
                  setImageLoading(false);
                  console.log('✅ Profile image loaded successfully');
                }}
                onError={(e) => {
                  console.error('❌ Profile image failed to load:', e.target.src);
                  setImageLoading(false);
                  
                  // ✅ ENHANCED: Better fallback handling for Google images
                  if (e.target && e.target.style) {
                    // Don't hide Google images immediately - they might load with retry
                    if (!e.target.src.includes('googleusercontent.com')) {
                      e.target.style.display = 'none';
                      
                      const nextElement = e.target.nextElementSibling;
                      if (nextElement && nextElement.style) {
                        nextElement.style.display = 'flex';
                      }
                    } else {
                      // For Google images, try one retry
                      setTimeout(() => {
                        const retryUrl = e.target.src.replace(/[?&](retry=\d+)/, '');
                        e.target.src = `${retryUrl}${retryUrl.includes('?') ? '&' : '?'}retry=${Date.now()}`;
                      }, 1000);
                    }
                  }
                }}
              />
            ) : (
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
            
            {/* Fallback placeholder (hidden by default) */}
            <div className="avatar-placeholder" style={{ display: 'none' }}>
              <i className="fas fa-user"></i>
              <small>Image failed to load</small>
            </div>
            
            {/* Image upload overlay */}
            <div className={`avatar-overlay ${imageUploading ? 'uploading' : ''}`}>
              {imageUploading ? (
                <div className="upload-spinner">
                  <div className="spinner"></div>
                  <small>Uploading...</small>
                </div>
              ) : (
                <div className="avatar-actions">
                  <button
                    className="avatar-btn upload-btn"
                    onClick={triggerFileInput}
                    title="Upload new picture"
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                  {user && user.picture && (
                    <button
                      className="avatar-btn delete-btn"
                      onClick={handleImageDelete}
                      title="Delete picture"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />

          <div className="avatar-info">
            <small className="upload-hint">
              <i className="fas fa-info-circle"></i>
              Click on your avatar to upload a new picture (Max 5MB, JPEG/PNG/GIF)
            </small>
            {isGoogleUser && (
              <small className="google-notice">
                <i className="fab fa-google"></i>
                ✨ You can upload a custom picture to override your Google profile picture
              </small>
            )}
          </div>
        </div>

        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <span className={`provider-badge ${user?.provider}`}>
            {user?.provider === 'google' ? (
              <>
                <i className="fab fa-google"></i> Google Account
              </>
            ) : (
              <>
                <i className="fas fa-envelope"></i> Email Account
              </>
            )}
          </span>
        </div>
      </div>

      {/* Profile tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <i className="fas fa-user"></i>
          Profile Information
        </button>
        {!isGoogleUser && (
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="fas fa-lock"></i>
            Change Password
          </button>
        )}
        <button 
          className={`tab-btn ${activeTab === 'danger' ? 'active' : ''}`}
          onClick={() => setActiveTab('danger')}
        >
          <i className="fas fa-exclamation-triangle"></i>
          Danger Zone
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <i className="fas fa-user"></i>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  disabled={loading || isGoogleUser}
                />
                {isGoogleUser && (
                  <small className="form-hint">Email cannot be changed for Google accounts</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  <i className="fas fa-phone"></i>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">
                  <i className="fas fa-calendar"></i>
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleProfileChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <i className="fas fa-map-marker-alt"></i>
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                placeholder="Street, City, State, ZIP"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                <i className="fas fa-info-circle"></i>
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="Tell us about yourself..."
                rows="4"
                maxLength="500"
                disabled={loading}
              />
              <small className="char-count">
                {profileData.bio.length}/500 characters
              </small>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Changes
                </>
              )}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && !isGoogleUser && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <h3>Change Password</h3>
            
            <div className="form-group">
              <label htmlFor="currentPassword">
                <i className="fas fa-lock"></i>
                Current Password *
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">
                <i className="fas fa-key"></i>
                New Password *
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                disabled={loading}
              />
              <small className="form-hint">Must be at least 6 characters long</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="fas fa-check-circle"></i>
                Confirm New Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Changing...
                </>
              ) : (
                <>
                  <i className="fas fa-key"></i>
                  Change Password
                </>
              )}
            </button>
          </form>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <div className="danger-zone">
            <h3>Danger Zone</h3>
            <div className="danger-section">
              <div className="danger-info">
                <h4>Delete Account</h4>
                <p>
                  Once you delete your account, there is no going back. 
                  This will permanently delete your account and all associated data.
                </p>
              </div>
              <button 
                className="btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
              >
                <i className="fas fa-trash"></i>
                Delete Account
              </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h4>Confirm Account Deletion</h4>
                    <button 
                      className="modal-close"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p><strong>This action cannot be undone!</strong></p>
                    <p>Are you sure you want to delete your account?</p>
                    
                    {!isGoogleUser && (
                      <div className="form-group">
                        <label htmlFor="deletePassword">
                          Enter your password to confirm:
                        </label>
                        <input
                          type="password"
                          id="deletePassword"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Enter your password"
                          disabled={loading}
                        />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={handleDeleteAccount}
                      disabled={loading || (!isGoogleUser && !deletePassword)}
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-trash"></i>
                          Delete Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Profile;
