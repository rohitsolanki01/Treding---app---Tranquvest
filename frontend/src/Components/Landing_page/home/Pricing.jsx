import React from 'react';

const Pricing = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center gy-4">

        <div className="col-12 col-md-6 col-lg-4 text-center text-md-start">
          <h1 className="mb-3">Unbeatable Pricing</h1>
          <p className="text-muted">
            We offer transparent and affordable pricing for all your investment needs.
            No hidden fees, no gimmicks — just simple and clear pricing.
          </p>
          <a href="/" className="text-decoration-none">
            See Pricing <i className="fa-solid fa-arrow-right ms-2"></i>
          </a>
        </div>


        <div className="d-none d-lg-block col-lg-2"></div>

        <div className="col-12 col-md-6 col-lg-6">
          <div className="row g-4">
            <div className="col-12 col-sm-6">
              <div className="border p-4 text-center h-100 rounded shadow-sm">
                <h1 className="mb-3">
                  <i className="fa-solid fa-indian-rupee-sign"></i>0
                </h1>
                <p className="text-muted">
                  Free equity delivery and direct mutual fund investments with no hidden fees.
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="border p-4 text-center h-100 rounded shadow-sm">
                <h1 className="mb-3">
                  <i className="fa-solid fa-indian-rupee-sign"></i>30
                </h1>
                <p className="text-muted">For intraday trading and options trading.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
