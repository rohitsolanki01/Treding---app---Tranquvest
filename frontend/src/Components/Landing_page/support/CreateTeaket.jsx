import React, { useState } from 'react'

const CreateTicket = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const supportCategories = [
    {
      id: 1,
      icon: "fa-solid fa-plus",
      title: "Account Opening",
      color: "primary",
      links: [
        "Online Account Opening",
        "Offline Account Opening", 
        "Company, Partnership and HUF Account Opening",
        "NRI Account Opening",
        "Charges at Tranquvest",
        "Tranquvest IDFC FIRST Bank 3-in-1 Account",
        "Getting Started"
      ]
    },
    {
      id: 2,
      icon: "fa-solid fa-user",
      title: "Your Tranquvest Account",
      color: "success",
      links: [
        "Login Credentials",
        "Account Modifications and Segment Addition",
        "DP ID And Bank Details",
        "Your Profile",
        "Transfers and Conversions of Shares"
      ]
    },
    {
      id: 3,
      icon: "fa-solid fa-chart-line",
      title: "Trading Dashboard",
      color: "info",
      links: [
        "Margin/Leverage, Product and Order Types",
        "Kite Web and Mobile",
        "Trading FAQs",
        "Corporate Actions",
        "Sentinel",
        "Kite API",
        "Stock Reports"
      ]
    },
    {
      id: 4,
      icon: "fa-solid fa-wallet",
      title: "Funds & Payments",
      color: "warning",
      links: [
        "Adding and Withdrawing Funds",
        "Payment Gateway Issues",
        "Bank Account Linking",
        "UPI and Net Banking",
        "Fund Transfer Delays",
        "Payment History"
      ]
    },
    {
      id: 5,
      icon: "fa-solid fa-mobile-alt",
      title: "Mobile App Support",
      color: "danger",
      links: [
        "App Installation Issues",
        "Login Problems",
        "Order Placement Issues",
        "App Performance",
        "Feature Requests",
        "Technical Glitches"
      ]
    },
    {
      id: 6,
      icon: "fa-solid fa-shield-alt",
      title: "Security & Privacy",
      color: "dark",
      links: [
        "Two-Factor Authentication",
        "Password Reset",
        "Account Security",
        "Privacy Settings",
        "Suspicious Activity",
        "Data Protection"
      ]
    }
  ];

  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h1 className="display-5 fw-bold text-dark mb-3">
              Create Support Ticket
            </h1>
            <p className="lead text-muted mb-4">
              Select a relevant topic below to create your support ticket
            </p>
            <div className="d-inline-flex align-items-center gap-2 bg-light rounded-pill px-4 py-2">
              <i className="fa-solid fa-clock text-primary"></i>
              <small className="text-muted">Average response time: 2-4 hours</small>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {supportCategories.map((category, index) => (
            <div key={category.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-header border-0 bg-transparent pb-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`bg-${category.color} bg-opacity-10 rounded-circle p-3 d-flex align-items-center justify-content-center`} style={{width: '3rem', height: '3rem'}}>
                        <i className={`${category.icon} text-${category.color} fs-5`}></i>
                      </div>
                      <h5 className="fw-bold mb-0 text-dark">{category.title}</h5>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-secondary rounded-circle d-md-none"
                      onClick={() => toggleSection(index)}
                      style={{width: '35px', height: '35px'}}
                    >
                      <i className={` fa-7 fa-solid fa-chevron-${expandedSection === index ? 'up' : 'down'} `}></i>
                    </button>
                  </div>
                </div>

                <div className={`card-body pt-3 ${expandedSection === index || window.innerWidth >= 768 ? 'd-block' : 'd-none'} d-md-block`}>
                  <div className="list-group list-group-flush">
                    {category.links.map((link, linkIndex) => (
                      <a 
                        key={linkIndex}
                        href="/" 
                        className="list-group-item list-group-item-action border-0 px-0 py-2 text-decoration-none hover-link"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <i className="fa-solid fa-circle-dot text-muted" style={{fontSize: '8px'}}></i>
                          <span className="text-dark fs-6">{link}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                
                </div>
              </div>
            </div>
          ))}
        </div>

    
        <div className="row mt-5">
          <div className="col-12">
            <div className="bg-light rounded-4 p-4">
              <div className="row align-items-center">
                <div className="col-12 col-md-8">
                  <h4 className="fw-bold mb-2">Can't find what you're looking for?</h4>
                  <p className="text-muted mb-3 mb-md-0">
                    Contact our support team directly for personalized assistance
                  </p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button className="btn btn-primary">
                      <i className="fa-solid fa-comments me-2"></i>
                      Live Chat
                    </button>
                    <button className="btn btn-outline-primary">
                      <i className="fa-solid fa-phone me-2"></i>
                      Call Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <h3 className="fw-bold mb-4">Frequently Asked Questions</h3>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card border-0 bg-primary bg-opacity-10 h-100">
                  <div className="card-body text-center p-4">
                    <i className="fa-solid fa-question-circle text-primary fs-2 mb-3"></i>
                    <h6 className="fw-bold">How to reset password?</h6>
                    <a className="stretched-link text-decoration-none">Learn more</a>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card border-0 bg-success bg-opacity-10 h-100">
                  <div className="card-body text-center p-4">
                    <i className="fa-solid fa-credit-card text-success fs-2 mb-3"></i>
                    <h6 className="fw-bold">Add funds to account?</h6>
                    <a className="stretched-link text-decoration-none">Learn more</a>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card border-0 bg-info bg-opacity-10 h-100">
                  <div className="card-body text-center p-4">
                    <i className="fa-solid fa-chart-bar text-info fs-2 mb-3"></i>
                    <h6 className="fw-bold">How to place orders?</h6>
                    <a className="stretched-link text-decoration-none">Learn more</a>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card border-0 bg-warning bg-opacity-10 h-100">
                  <div className="card-body text-center p-4">
                    <i className="fa-solid fa-file-alt text-warning fs-2 mb-3"></i>
                    <h6 className="fw-bold">Account statements?</h6>
                    <a className="stretched-link text-decoration-none">Learn more</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default CreateTicket
