import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import "./SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  // Dynamic URL functions
  const getAPIUrl = () => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:8080";
    console.log('🔄 API URL:', url);
    return url;
  };
  
  const getDashboardUrl = () => {
    const url = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5174";
    console.log('🔄 Dashboard URL:', url);
    return url;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const redirectToDashboard = (token, user) => {
    const encodedToken = encodeURIComponent(token);
    const encodedUser = encodeURIComponent(JSON.stringify(user));
    const dashboardUrl = `${getDashboardUrl()}/dashboard?token=${encodedToken}&user=${encodedUser}`;
    
    console.log('🔄 Redirecting to:', dashboardUrl);
    
    setTimeout(() => {
      window.location.href = dashboardUrl;
    }, 1500);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('🔄 Making signup request to:', `${getAPIUrl()}/api/auth/register`);
      
      const res = await axios.post(`${getAPIUrl()}/api/auth/register`, {
        email: email.trim(),
        password,
        name: name.trim(),
      });

      console.log('✅ Signup successful:', res.data);

      const { token, user } = res.data;

      if (!token || !user) {
        toast.error("Invalid server response");
        return;
      }

      login(user, token);
      toast.success(`Welcome ${user.name}! Account created successfully!`);

      redirectToDashboard(token, user);
      
    } catch (err) {
      console.error("❌ Registration error:", err.response || err);
      
      if (err.code === 'ERR_NETWORK' || err.message.includes('ERR_CONNECTION_REFUSED')) {
        toast.error("Connection failed. Please check if the server is running.");
      } else if (err.response?.status === 409) {
        toast.error("Email already exists. Please use a different email or try logging in.");
      } else {
        const errorMessage = err.response?.data?.message || "Registration failed";
        toast.error(errorMessage);
      }

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
    try {
      console.log('🔄 Google signup initiated');
      const token = credentialResponse.credential;

      console.log('🔄 Making Google auth request to:', `${getAPIUrl()}/api/auth/google`);

      const res = await axios.post(`${getAPIUrl()}/api/auth/google`, {
        token,
      });

      console.log('✅ Google signup successful:', res.data);

      const { token: authToken, user } = res.data;

      if (!authToken || !user) {
        toast.error("Invalid server response");
        return;
      }

      login(user, authToken);
      toast.success(`Welcome ${user.name}!`);

      redirectToDashboard(authToken, user);
      
    } catch (err) {
      console.error("❌ Google signup error:", err.response || err);
      
      if (err.code === 'ERR_NETWORK' || err.message.includes('ERR_CONNECTION_REFUSED')) {
        toast.error("Connection failed. Please check if the server is running.");
      } else {
        toast.error(err.response?.data?.message || "Google signup failed");
      }
    }
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
              <input type="checkbox" required />
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
            onError={() => toast.error("Google Sign Up Failed")}
            theme="outline"
            size="large"
            width="100%"
            text="signup_with"
            use_fedcm_for_prompt={true}
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
