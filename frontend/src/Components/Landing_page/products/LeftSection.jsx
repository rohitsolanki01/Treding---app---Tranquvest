import React from "react";

const LeftSection = ({
  imageUrl,
  productName,
  productDescription,
  tyrDemo,
  learnMore,
  googlePlay,
  appStore,
}) => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">

        <div className="col-12 col-md-6 mb-4 mb-md-0 text-center">
          <img
            className="img-fluid"
            src={imageUrl}
            style={{ maxWidth: "100%", height: "auto" }}
            alt="Product"
          />
        </div>


        <div className="col-12 col-md-6">
          <h1 className="fs-2">{productName}</h1>
          <p className="mt-3 text-muted" style={{ lineHeight: "1.7" }}>
            {productDescription}
          </p>

          <div className="mt-4 d-flex flex-wrap gap-3">
            <a
              href={tyrDemo}
              style={{ minWidth: "140px" , textDecoration:"none"}}
            >
              Try Demo <i className="fa-solid fa-arrow-right ms-2"></i>
            </a>
            <a
              href={learnMore}
              style={{ minWidth: "140px" , textDecoration:"none" }}
            >
              Learn More <i className="fa-solid fa-arrow-right ms-2"></i>
            </a>
          </div>

   
          <div className="d-flex flex-wrap gap-3 mt-4">
            <a href={googlePlay}>
              <img
                src="media/googlePlayBadge.svg"
                alt="Get it on Google Play"
                className="img-fluid"
                style={{ maxWidth: "150px", height: "auto" }}
              />
            </a>
            <a href={appStore}>
              <img
                src="media/appstoreBadge.svg"
                alt="Download on the App Store"
                className="img-fluid"
                style={{ maxWidth: "150px", height: "auto" }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
