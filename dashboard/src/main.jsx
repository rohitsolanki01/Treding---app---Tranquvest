import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from './context/AuthContext';
import Home from "./Components/Home"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="421864464984-611fn7f9a8vmoqpevfncba4chml6h1e5.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<Home />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
