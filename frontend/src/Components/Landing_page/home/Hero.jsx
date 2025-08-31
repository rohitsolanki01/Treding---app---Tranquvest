import React from 'react';
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center align-items-center text-center">
        <div className="col-12 col-md-10 col-lg-8 px-4">
       
          <img
            src="media/tranquvest-dashboard-svg.svg"
            alt="Hero Image"
            className="img-fluid mb-4 hero-img"
          />
          <h1 className="hero-title fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
            Smart Investing, Unlimited Choices
          </h1>
          <p className="hero-desc text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Trade stocks, options, mutual funds, ETFs, and more — with a seamless online experience.
          </p>

            <button className="button border-0" onClick={() => navigate("/signup")}>
      Sign Up Now
    </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
