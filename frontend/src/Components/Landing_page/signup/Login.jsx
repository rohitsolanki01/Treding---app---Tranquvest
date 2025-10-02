import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Attempting login to:", `${API_BASE_URL}/login`);
      
      // Updated endpoint - removed /api/auth prefix to match Railway backend
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email: email.trim(),
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log("Login response:", res.data);

      const { token, user } = res.data;
      
      if (!token || !user) {
        toast.error("Invalid server response");
        return;
      }

      // Store in context and localStorage
      login(user, token);
      toast.success(`✅ Welcome back, ${user.name}!`);
      
      // Redirect to dashboard
      redirectToDashboard(token, user);
      
    } catch (err) {
      console.error("Login error:", err);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || errorMessage;
        
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.status === 404) {
          errorMessage = "Account not found. Please sign up first.";
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Cannot connect to server. Please check your connection.";
      }
      
      toast.error(errorMessage);
      
      // Suggest Google login if applicable
      if (err.response?.data?.suggestion === "google_login") {
        setTimeout(() => {
          toast.info("💡 Try logging in with Google instead");
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
      
      console.log("Attempting Google login to:", `${API_BASE_URL}/auth/google`);
      
      // Updated endpoint - matches Railway backend
      const res = await axios.post(`${API_BASE_URL}/auth/google`, {
        token,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log("Google login response:", res.data);

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
      console.error("Google login error:", err);
      
      let errorMessage = "Google login failed. Please try again.";
      
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
    console.error("Google login cancelled or failed");
    toast.error("❌ Google login was cancelled");
  };

  return (
    <div className="login-container">
      <div className="login-bg-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <i className="fas fa-user-circle"></i>
          </div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className={`btn-login ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
            text="continue_with"
            useOneTap
          />
        </div>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="signup-link">
              Create account
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

export default Login;