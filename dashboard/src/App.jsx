import { useState } from 'react'
import Dashboard from './Components/Dashboard'
import './App.css'

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="auth-message">
          <h2>Authentication Required</h2>
          <p>Please log in to access the trading dashboard.</p>
          <a 
            href="http://localhost:5173/login" 
            className="login-btn"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
        < Dashboard/>
    </>
  )
}

export default App
