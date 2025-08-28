import React from 'react'

const Hero = () => {
  return (
    <>
      <div className="container-fluid bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            
            {/* Text Content */}
            <div className="col-12 col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
              <h1 className="display-4 display-md-3 fw-bold mb-3 mb-md-4">
                We're Here to Help
              </h1>
              <p className="lead fs-5 fs-md-4 mb-4 mb-md-5 text-light">
                Get instant support for all your trading and investment needs. 
                Our expert team is available 24/7 to assist you.
              </p>
              
              {/* CTA Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <button className="btn btn-light btn-lg px-4 py-2 fw-semibold text-primary">
                  Start Live Chat
                </button>
                <button className="btn btn-outline-light btn-lg px-4 py-2 fw-semibold">
                  Browse FAQs
                </button>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="col-12 col-lg-6 text-center">
              <div className="position-relative">
                <img 
                  src="media/customer_suffort_illutions.png" 
                  alt="Customer support illustration" 
                  className="img-fluid w-100"
                  style={{maxWidth: '500px'}}
                />
                
                {/* Floating Support Icons */}
                <div className="position-absolute top-0 start-0 d-none d-md-block">
                  <div className="bg-white rounded-circle p-3 shadow-sm" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-headset text-primary fs-4"></i>
                  </div>
                </div>
                
                <div className="position-absolute top-50 end-0 d-none d-md-block">
                  <div className="bg-white rounded-circle p-3 shadow-sm" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-comments text-success fs-4"></i>
                  </div>
                </div>
                
                <div className="position-absolute bottom-0 start-50 translate-middle-x d-none d-lg-block">
                  <div className="bg-white rounded-circle p-3 shadow-sm" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-phone text-info fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Support Stats */}
      <div className="container-fluid bg-light py-4">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <h3 className="fs-4 fs-md-3 fw-bold text-primary mb-1">24/7</h3>
                <p className="text-muted mb-0 fs-6 fs-md-5">Support Available</p>
              </div>
            </div>
            
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <h3 className="fs-4 fs-md-3 fw-bold text-success mb-1">&lt;2min</h3>
                <p className="text-muted mb-0 fs-6 fs-md-5">Average Response</p>
              </div>
            </div>
            
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <h3 className="fs-4 fs-md-3 fw-bold text-warning mb-1">98%</h3>
                <p className="text-muted mb-0 fs-6 fs-md-5">Customer Satisfaction</p>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <h3 className="fs-4 fs-md-3 fw-bold text-info mb-1">50K+</h3>
                <p className="text-muted mb-0 fs-6 fs-md-5">Issues Resolved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Contact Methods */}
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="fs-2 fs-md-1 fw-bold mb-3">Choose Your Preferred Support Method</h2>
            <p className="text-muted fs-5">Multiple ways to get the help you need, when you need it</p>
          </div>
        </div>
        
        <div className="row g-4">
          {/* Live Chat */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm text-center p-4 hover-card">
              <div className="card-body">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="fas fa-comments fs-2 text-primary"></i>
                </div>
                <h4 className="fw-bold mb-3">Live Chat</h4>
                <p className="text-muted mb-4">Instant messaging with our support team</p>
                <button className="btn btn-primary w-100">Start Chat</button>
              </div>
            </div>
          </div>

          {/* Phone Support */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm text-center p-4 hover-card">
              <div className="card-body">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="fas fa-phone fs-2 text-success"></i>
                </div>
                <h4 className="fw-bold mb-3">Phone Support</h4>
                <p className="text-muted mb-4">Speak directly with our experts</p>
                <button className="btn btn-success w-100">Call Now</button>
              </div>
            </div>
          </div>

          {/* Email Support */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm text-center p-4 hover-card">
              <div className="card-body">
                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="fas fa-envelope fs-2 text-info"></i>
                </div>
                <h4 className="fw-bold mb-3">Email Support</h4>
                <p className="text-muted mb-4">Send us your queries via email</p>
                <button className="btn btn-info w-100">Send Email</button>
              </div>
            </div>
          </div>

          {/* Help Center */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm text-center p-4 hover-card">
              <div className="card-body">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="fas fa-book fs-2 text-warning"></i>
                </div>
                <h4 className="fw-bold mb-3">Help Center</h4>
                <p className="text-muted mb-4">Browse our comprehensive guides</p>
                <button className="btn btn-warning w-100">Browse Guides</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for hover effects */}
      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        .min-vh-50 {
          min-height: 50vh;
        }
        
        @media (max-width: 768px) {
          .min-vh-50 {
            min-height: 40vh;
          }
        }
      `}</style>
    </>
  )
}

export default Hero
