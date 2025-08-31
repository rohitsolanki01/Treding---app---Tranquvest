import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from "../../Navbar"
import Hero from "./Hero"
import Awards from "./Awards"
import Stats from "./Stats"
import Pricing from "./Pricing"
import Education from "./Education"
import OpenAccount from "../../OpenAccount"


const HomeWrapper = () => {
  const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    if (isAuthenticated) {
      const { user, token } = useAuth();
      const encodedToken = encodeURIComponent(token);
      const encodedUser = encodeURIComponent(JSON.stringify(user));
      window.location.href = `http://localhost:5174/dashboard?token=${encodedToken}&user=${encodedUser}`;
      return null;
    }
    
    return children;
  };
  return (
    <>
  
    <Hero />
    <Awards />
    <Stats />
    <Pricing />
    <Education />
    <OpenAccount />


    </>
  )

  };
  


export default HomeWrapper