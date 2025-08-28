import React from 'react'

const Education = () => {
  return (
  <>
     <div className="container py-5">
      <div className="row justify-content-center align-items-center gy-5">
   
        <div className="col-12 col-md-6 text-center">
          <img
            src="media/varsity_geometric_design.svg"
            alt="Largest Broker"
            className="img-fluid"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="col-12 col-md-6 text-center text-md-start mt-5">
          <h2 className="fw-bold">Free and open market education</h2>
          <p className="pt-2 text-muted">
           Varsity , the largest stock market education book in the world covering everything from the basics to the advanced  trading concepts.
          </p>
          <a href="" className="text-decoration-none">
            Read More <i className="fa-solid fa-arrow-right ms-2"></i>
          </a>
        </div>
      </div>
    </div>
  </>
  )
}

export default Education