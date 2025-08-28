import React from "react";

const BrokeRage = () => {
  return (
    <>
      <div className="container border-top">
        <div className="row mt-5">
          <div className="col-12 col-md-8 col-lg-6 col-md-8" style={{ paddingLeft: "50px" }}>
            <a href="/pricing" style={{ textDecoration: "none" }}>
              <h1 className="fs-5  text-center">Brokerage calculator</h1>
            </a>
            <ul className="mt-3" style={{ lineHeight: "1.8" }}>
              <li className="py-1 text-muted fs-6 ps-3">
                ₹100 per order for futures and options.
              </li>
              <li className="py-1 text-muted fs-6 ps-3">
                For a PIS account, 0.5% or ₹200 per executed order for equity
                (whichever is lower)
              </li>
              <li className="py-1 text-muted fs-6 ps-3">
                ₹500 + GST as yearly account maintenance charges (AMC) charges.
              </li>
              <li className="py-1 text-muted fs-6 ps-3">
                Equity and Futures - ₹10 per crore + GST of the traded value.
              </li>
              <li className="py-1 text-muted fs-6 ps-3">
                Currency - ₹0.05 per lakh + GST of turnover for Futures and ₹2
                per lakh + GST of premium for Options.
              </li>
              <li className="py-1 text-muted fs-6 ps-3">
                MTF pledge charge: ₹15 + GST per pledge and unpledge request per
                ISIN.
              </li>
              <li className="py-1 text-muted fs-6 ps-3">
                Delivery & MTF Brokerage: 0.5% per executed orde
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-8 col-lg-6 col-md-8" style={{ paddingLeft: "50px" }}>
            <a href="/pricing" style={{ textDecoration: "none" }}>
              <h1 className="fs-5 text-center">List of charges</h1>
            </a>

            <ul className="mt-3 " style={{ lineHeight: "1.8" }}>
              <li className="py-1 text-muted fs-6 ps-3">₹100 per order</li>
              <li className="py-1 text-muted fs-6 ps-3">
                NRI account (offline only)₹500
              </li>
              <li className="py-1 text-muted fs-6 ps-3">
                Partnership, LLP, HUF, or Corporate accounts (offline only)₹500
              </li>
              <li className="py-1 text-muted fs-6 ps-3">Online account ₹0</li>
              <li className="py-1 text-muted fs-6 ps-3">Offline account ₹0</li>
              <li className="py-1 text-muted fs-6 ps-3">
                Kite Connect monthly ₹500
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrokeRage;
