import React from 'react'

const Hero = () => {
  return (
    <>
      <div className="container py-5 text-center mt-5">
        <div className="row">
          <div className="col-12 border-bottom pb-5 mb-5">
            <h1 className="display-4 display-md-3">Pricing</h1>
            <p className="text-muted mt-3 fs-6 fs-md-5 px-2 px-md-0">
              Free equity investment and flat &#8377;20 intraday and F&O trades.
            </p>
          </div>
        </div>
        
        <div className="row g-4 mt-2 justify-content-center align-items-stretch">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="h-100 p-3 p-md-4">
              <div className="mb-3 mb-md-4">
                <img 
                  src="media/pricingEquity.svg" 
                  alt="Free equity delivery" 
                  className="img-fluid mb-3"
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              </div>
              <h2 className="h3 h2-md mb-3">Free equity delivery</h2>
              <p className="text-muted fs-6 fs-md-5 px-2 px-md-0">
                All equity delivery investments (NSE, BSE), are absolutely free. &#8377;0 brokerage.
              </p>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="h-100 p-3 p-md-4">
              <div className="mb-3 mb-md-4">
                <img 
                  src="media/intradayTrades.svg" 
                  alt="Intraday trades" 
                  className="img-fluid mb-3"
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              </div>
              <h2 className="h3 h2-md mb-3">Intraday trades</h2>
              <p className="text-muted fs-6 fs-md-5 px-2 px-md-0">
                Flat ₹ 20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades. Flat ₹20 on all option trades.
              </p>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="h-100 p-3 p-md-4">
              <div className="mb-3 mb-md-4">
                <img 
                  src="media/pricingEquity.svg" 
                  alt="Free direct MF" 
                  className="img-fluid mb-3"
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              </div>
              <h2 className="h3 h2-md mb-3">Free direct MF</h2>
              <p className="text-muted fs-6 fs-md-5 px-2 px-md-0">
                All direct mutual fund investments are absolutely free — ₹ 0 commissions & DP charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
