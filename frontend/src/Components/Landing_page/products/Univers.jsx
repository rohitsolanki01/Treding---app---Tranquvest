import React from 'react'

const Univers = () => {
  return (
    <>
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h1 className='display-5  mb-3 fs-1'>The Tranquvest Universe</h1>
              <p className='text-muted fs-5 px-3'>Extend your trading and investment experience even further with our partner platforms.</p>
            </div>
          </div>
          
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                    <img 
                      src="media/smallcaseLogo.png" 
                      alt="Smallcase Logo" 
                      className="img-fluid"
                      style={{maxWidth: '160px', maxHeight: '60px'}}
                    />
                  </div>
                  <p className='text-muted fs-6 mb-0'>Thematic investment platform</p>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                    <img 
                      src="media/streakLogo.png" 
                      alt="Streak Logo" 
                      className="img-fluid"
                      style={{maxWidth: '160px', maxHeight: '60px'}}
                    />
                  </div>
                  <p className='text-muted fs-6 mb-0'>Algo & strategies platform</p>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                    <img 
                      src="media/sensibullLogo.svg" 
                      alt="Sensibull Logo" 
                      className="img-fluid"
                      style={{maxWidth: '160px', maxHeight: '60px'}}
                    />
                  </div>
                  <p className='text-muted fs-6 mb-0'>Options trading platform</p>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                    <img 
                      src="media/zerodhaFundhouse.png" 
                      alt="Zerodha Fundhouse Logo" 
                      className="img-fluid"
                      style={{maxWidth: '160px', maxHeight: '60px'}}
                    />
                  </div>
                  <p className='text-muted fs-6 mb-0'>Assets management</p>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                    <img 
                      src="media/goldenpiLogo.png" 
                      alt="GoldenPi Logo" 
                      className="img-fluid"
                      style={{maxWidth: '160px', maxHeight: '60px'}}
                    />
                  </div>
                  <p className='text-muted fs-6 mb-0'>Bonds trading platform</p>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                    <img 
                      src="media/dittoLogo.png" 
                      alt="Ditto Logo" 
                      className="img-fluid"
                      style={{maxWidth: '160px', maxHeight: '60px'}}
                    />
                  </div>
                  <p className='text-muted fs-6 mb-0'>Insurance</p>
                </div>
              </div>
            </div>
          </div>

        </div>
        <button className="button border-0 mt-5">
            Sign Up Now
          </button>
      </div>
    </>
  )
}

export default Univers