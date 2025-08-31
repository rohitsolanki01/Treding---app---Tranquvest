import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const redirectToDashboard = (token, user) => {
    const encodedToken = encodeURIComponent(token);
    const encodedUser = encodeURIComponent(JSON.stringify(user));
    const dashboardUrl = `http://localhost:5174/dashboard?token=${encodedToken}&user=${encodedUser}`;
    
    setTimeout(() => {
      window.location.href = dashboardUrl;
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("https://treding-app-tranquvest-5.onrender.com/api/auth/google", {
        email,
        password,
      });

      const { token, user } = res.data;
      
      if (!token || !user) {
        toast.error("Invalid server response");
        return;
      }

      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      
      redirectToDashboard(token, user);
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      
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
    try {
      const token = credentialResponse.credential;

      const res = await axios.post("https://treding-app-tranquvest-5.onrender.com/api/auth/google", {
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
      console.error("Google login error:", err);
      toast.error(err.response?.data?.message || "Google login failed");
    }
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
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
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
            onError={() => toast.error("Google Login Failed")}
            theme="outline"
            size="large"
            width="100%"
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
