import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { login } = useAuth();

  // ✅ Vite environment variables - Make sure these are set in .env file
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5174";

  // Enhanced redirect with better error handling
  const redirectToDashboard = (token, user) => {
    try {
      const encodedToken = encodeURIComponent(token);
      const encodedUser = encodeURIComponent(JSON.stringify(user));
      const dashboardUrl = `${DASHBOARD_URL}/dashboard?token=${encodedToken}&user=${encodedUser}`;
      
      console.log("Redirecting to:", dashboardUrl);
      
      setTimeout(() => {
        window.location.href = dashboardUrl;
      }, 1500);
    } catch (error) {
      console.error("Redirect error:", error);
      toast.error("Navigation failed. Please try again.");
    }
  };

  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return false;
    }
    
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms & Conditions");
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Attempting registration to:", `${API_BASE_URL}/register`);
      
      // Updated endpoint - removed /api/auth prefix to match Railway backend
      const res = await axios.post(`${API_BASE_URL}/register`, {
        email: email.trim(),
        password,
        name: name.trim(),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log("Registration response:", res.data);

      const { token, user } = res.data;
      
      if (!token || !user) {
        toast.error("Invalid server response");
        return;
      }

      // Store in context and localStorage
      login(user, token);
      toast.success(`✅ Welcome ${user.name}! Account created successfully!`);
      
      // Redirect to dashboard
      redirectToDashboard(token, user);
      
    } catch (err) {
      console.error("Registration error:", err);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || errorMessage;
        
        if (err.response.status === 409) {
          errorMessage = "Email already exists. Please login instead.";
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.message || "Invalid registration data";
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Cannot connect to server. Please check your connection.";
      }
      
      toast.error(errorMessage);
      
      // Suggest Google signup if applicable
      if (err.response?.data?.suggestion === "google_login") {
        setTimeout(() => {
          toast.info("💡 Try signing up with Google instead");
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    
    try {
      const token = credentialResponse.credential;
      
      console.log("Attempting Google signup to:", `${API_BASE_URL}/auth/google`);
      
      // Updated endpoint - matches Railway backend
      const res = await axios.post(`${API_BASE_URL}/auth/google`, {
        token,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log("Google signup response:", res.data);

      const { token: authToken, user } = res.data;

      if (!authToken || !user) {
        toast.error("Invalid server response");
        return;
      }

      // Store in context and localStorage
      login(user, authToken);
      toast.success(`✅ Welcome ${user.name}!`);

      // Redirect to dashboard
      redirectToDashboard(authToken, user);
      
    } catch (err) {
      console.error("Google signup error:", err);
      
      let errorMessage = "Google signup failed. Please try again.";
      
      if (err.response) {
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "Cannot connect to server. Please check your connection.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google signup cancelled or failed");
    toast.error("❌ Google signup was cancelled");
  };

  return (
    <div className="signup-container">
      <div className="signup-bg-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Join us today! Please fill in your details</p>
        </div>

        <form onSubmit={handleRegister} className="signup-form">
          <div className="form-group">
            <div className="input-wrapper">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                className="form-control enhanced-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                className="form-control enhanced-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control enhanced-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password (min 6 characters)"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="form-terms">
            <label className="terms-checkbox">
              <input 
                type="checkbox" 
                required 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isLoading}
              />
              <span>
                I agree to the <a href="/terms" className="terms-link">Terms & Conditions</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`btn-signup ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>or sign up with</span>
        </div>

        <div className="google-signup-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
            text="signup_with"
            useOneTap
          />
        </div>

        <div className="signup-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Sign in here
            </a>
          </p>
        </div>
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

export default SignUp;