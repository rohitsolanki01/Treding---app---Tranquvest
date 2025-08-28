import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-breakout bg-light pt-5 pb-4 border-top">
      <div className="container">
        <div className="row gy-5 justify-content-between">

          <div className="col-lg-4 col-md-6">
            <a href="/" className="d-flex align-items-center mb-3 text-dark text-decoration-none">
              <img src="media/tranquvest_logo.svg" alt="Nestigo Logo" height="50" className="me-2" />
            </a>
            <p className="text-muted">
            Start trading with confidence. Tranquvest is built for new and experienced investors alike.
            </p>
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} Tranquvest. All rights reserved.
            </p>
            <div className="mt-3">
              <a href="https://github.com/rohitsolanki01" className="text-muted me-3"><i className="fa-brands fa-github"></i></a>
              <a href="https://x.com/Rohit_01_tech" className="text-muted me-3"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="https://www.instagram.com/rohit__solanki__32/" className="text-muted me-3"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://www.linkedin.com/in/rohit-solanki-495860348/" className="text-muted"><i className="fa-brands fa-linkedin"></i></a>
            </div>
          </div>

      
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-semibold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-muted d-block mb-2">About Us</a></li>
              <li><a href="/product" className="text-muted d-block mb-2">Product</a></li>
              <li><a href="/pricing" className="text-muted d-block mb-2">Pricing</a></li>
              <li><a href="/blogs" className="text-muted d-block mb-2">Tranquvest.tech-blogs</a></li>
            </ul>
          </div>

      
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-semibold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><a href="/support" className="text-muted d-block mb-2">Support Center</a></li>
              <li><a href="/pricing" className="text-muted d-block">List of Charges</a></li>
            </ul>
          </div>

   
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-semibold mb-3">Account</h6>
            <ul className="list-unstyled">
              <li><a href="/signup" className="text-muted d-block mb-2">Open an Account</a></li>
              <li><a href="/founds" className="text-muted d-block mb-2">Fund Transfer</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-semibold mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li><a href="/term-condition" className="text-muted d-block mb-2">Terms & Conditions</a></li>
              <li><a href="/policy" className="text-muted d-block mb-2">Privacy Policy</a></li>
              <li><a href="/disclaimer" className="text-muted d-block">Disclaimer</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-4 pt-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center text-center">
          <div className="text-muted small owner_me"><div className="text-muted small owner_me">
  Built with{' '}
  <span
  style={{
    background: 'linear-gradient(to right, #c471f5, #fa71cd, #ffc2a1, #a1c4fd)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    display: 'inline-block',
    animation: 'pulse 1.5s infinite',
  }}
  >
    ❤️
  </span>{' '}
  and crafted by Rohit Solanki.
</div>
</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
