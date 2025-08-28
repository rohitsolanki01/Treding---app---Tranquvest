import React from 'react'

const OpenAccount = () => {
  return (
   <>
   <div className="container-fluid py-1">
      <div className="row justify-content-center align-items-center text-center">
        <div className="col-12 col-md-10 col-lg-8 px-4">
       
          <h1 className="hero-title fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
            Open a Tranquvest Account
          </h1>
          <p className="hero-desc text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Open a free demate account in a minute and start trading stocks, options, mutual funds, and more.
          </p>

         <button className="button border-0 " onClick={() => window.location.href = "http://localhost:5174/signup"}>
            Open Account
          </button>
        </div>
      </div>
    </div>
   </>
  )
}

export default OpenAccount