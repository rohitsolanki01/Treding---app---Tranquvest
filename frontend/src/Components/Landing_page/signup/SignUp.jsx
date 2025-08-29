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
  // ✅ Use environment variables for live deployment
  const API_BASE_URL =  "http://localhost:8080";
  const DASHBOARD_URL ="http://localhost:5174";
  const redirectToDashboard = (token, user) => {
    const encodedToken = encodeURIComponent(token);
    const encodedUser = encodeURIComponent(JSON.stringify(user));
    const dashboardUrl = `${DASHBOARD_URL}/dashboard?token=${encodedToken}&user=${encodedUser}`;
    
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
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email: email.trim(),
        password,
        name: name.trim(),
      });
      const { token, user } = res.data;
      if (!token || !user) {
        toast.error("Invalid server response");
        return;
      }
      login(user, token);
      toast.success(`Welcome ${user.name}! Account created successfully!`);
      redirectToDashboard(token, user);
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
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
      const token = credentialResponse.credential;
      const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        token,
      });
      const { token: authToken, user } = res.data;
      if (!authToken || !user) {
        toast.error("Invalid server response");
        return;
      }
      login(user, authToken);
      toast.success(`Welcome ${user.name}!`);
      redirectToDashboard(authToken, user);
    } catch (err) {
      console.error("Google signup error:", err);
      toast.error(err.response?.data?.message || "Google signup failed");
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
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
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