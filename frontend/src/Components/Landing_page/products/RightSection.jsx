import React from 'react';

const RightSection = ({
  imageUrl,
  productName,
  productDescription,
  learnMore,
}) => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
     
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <h1 className="fs-2">{productName}</h1>
          <p className="mt-3 text-muted" style={{ lineHeight: "1.7" }}>
            {productDescription}
          </p>
          <div className="mt-4">
            <a
              href={learnMore}
              style={{ minWidth: "140px" , textDecoration:"none"}}
            >
              Learn More <i className="fa-solid fa-arrow-right ms-2"></i>
            </a>
          </div>
        </div>

        <div className="col-12 col-md-6 text-center">
          <img
            className="img-fluid"
            src={imageUrl}
            alt="Product"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RightSection;
