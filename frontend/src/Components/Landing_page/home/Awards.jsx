import React from 'react';

const Awards = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center gy-5">
   
        <div className="col-12 col-md-6 text-center">
          <img
            src="media/largestBroker.svg"
            alt="Largest Broker"
            className="img-fluid"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="col-12 col-md-6 text-center text-md-start">
          <h2 className="fw-bold">Largest Broker in India</h2>
          <p className="pt-2 text-muted">
            With over 1 million clients, Tranquvest is the largest broker in India, with a daily retail order volume of
            over 15% of all retail order volumes in India.
          </p>

          <div className="row mt-4">
            <div className="col-12 col-sm-6">
              <ul className="list-unstyled">
                <li className="py-1">📈 Stocks</li>
                <li className="py-1">🧠 Options</li>
                <li className="py-1">💼 Mutual Funds</li>
                <li className="py-1">📊 ETFs</li>
              </ul>
            </div>
            <div className="col-12 col-sm-6">
              <ul className="list-unstyled">
                <li className="py-1">⛏️ Commodities</li>
                <li className="py-1">📃 Derivatives</li>
                <li className="py-1">🌐 Forex</li>
                <li className="py-1">🏦 Fixed Deposits</li>
              </ul>
            </div>
          </div>


          <div className="mt-4 text-center text-md-start">
            <img
              src="media/pressLogos.png"
              alt="Press Coverage"
              className="img-fluid"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awards;
