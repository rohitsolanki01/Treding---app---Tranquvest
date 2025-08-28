import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {

  const closeMenu = () => {
    const navbar = document.getElementById("navbarNavAltMarkup");
    if (navbar && navbar.classList.contains("show")) {
      new window.bootstrap.Collapse(navbar).hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-md border-bottom sticky-top" style={{ backgroundColor: "#ffffff" }}>
      <div className="container-fluid">
   
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src="media/tranquvest_logo.svg" alt="Logo" height="60" className="me-2" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link active" to="/signup" onClick={closeMenu}>Sign Up</NavLink>
            <NavLink className="nav-link active" to="/login" onClick={closeMenu}>Login</NavLink>
            <NavLink className="nav-link active" to="/about" onClick={closeMenu}>About</NavLink>
            <NavLink className="nav-link active" to="/product" onClick={closeMenu}>Product</NavLink>
            <NavLink className="nav-link active" to="/support" onClick={closeMenu}>Support</NavLink>
            <NavLink className="nav-link active" to="/pricing" onClick={closeMenu}>Pricing</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
