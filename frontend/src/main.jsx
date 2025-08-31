import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import PricingWrapper from './Components/Landing_page/pricing/PricingWrapper.jsx'
import SignUp from './Components/Landing_page/signup/SignUp.jsx'
import ProductWrapper from './Components/Landing_page/products/ProductWrapper.jsx'
import AboutWrapper from './Components/Landing_page/about/AboutWrapper.jsx'
import SupportWrapper from './Components/Landing_page/support/SupportWrapper.jsx'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import PageNotFound from './Components/PageNotFound'
import Login from './Components/Landing_page/signup/Login.jsx'
import BlogsSection from './Components/Landing_page/BlogsSection.jsx'
import FoundTran from './Components/FoundTran.jsx'
import PrivacyPolicy from"./Components/PrivacyPolicy.jsx"
import Disclaimer from "./Components/Disclaimer.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google";
import TermsAndConditions from './Components/TermsAndConditions.jsx'
import { AuthProvider } from './Components/Landing_page/contexts/AuthContext'; 

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="421864464984-611fn7f9a8vmoqpevfncba4chml6h1e5.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider> {/* Wrap everything with AuthProvider */}
       
        <Routes>
           <Navbar />
          <Route path="/" element={<App />} />
          <Route path="pricing" element={<PricingWrapper />} />
          <Route path='signup' element={<SignUp />}/>
          <Route path='login' element={<Login />} />
          <Route path='product' element={<ProductWrapper />}/>
          <Route path='about' element={<AboutWrapper />}/>
          <Route path='support' element={<SupportWrapper />}/>
          <Route path='blogs' element={<BlogsSection />}/>
          <Route path='founds' element={<FoundTran />}/>
          <Route path='term-condition' element={<TermsAndConditions />}/>
          <Route path='policy' element={<PrivacyPolicy />}/>
          <Route path='*' element={<PageNotFound />}/>
          <Route path='disclaimer' element={<Disclaimer />}/>
            <Footer />
        </Routes>
      
      </AuthProvider> {/* Close AuthProvider */}
    </BrowserRouter> 
  </GoogleOAuthProvider>
)
