import React from 'react';

const Stats = () => {
  return (
    <div className="container py-5 my-5 mt-5">
      <div className="row align-items-center">
    
        <div className="col-12 col-lg-6 mb-5 mb-lg-0 ">
          <h1 className="stats-heading-one mb-4  text-lg-start">
            Trust with confidence
          </h1>

          <div className="mb-4 px-2 px-lg-0">
            <h2 className="sub-heading">Customer-first always</h2>
            <p className="text-muted sub-heading-para">
              That's why 1.3+ crore customers trust Tranquvest with{' '}
              <i className="fa-solid fa-indian-rupee-sign"></i>3.5+ lakh crores worth of equity investments.
            </p>
          </div>

          <div className="mb-4 px-2 px-lg-0">
            <h2 className="sub-heading">No spam or gimmicks</h2>
            <p className="text-muted sub-heading-para">
              No gimmicks, spam, "gamification", or annoying push notifications. High quality that you use at your pace,
              the way you like.
            </p>
          </div>

          <div className="mb-4 px-2 px-lg-0">
            <h2 className="sub-heading">The Tranquvest universe</h2>
            <p className="text-muted sub-heading-para">
              Not just a broker, but a complete ecosystem of tools and services to help you achieve your financial goals.
              Our investments in 30+ fintech startups offer you tailored services specific to your needs.
            </p>
          </div>

          <div className="mb-4 px-2 px-lg-0">
            <h2 className="sub-heading">Do better with money</h2>
            <p className="text-muted sub-heading-para">
              With initiatives like Nudge and Kill Switch, we don't just facilitate your investments but also help you make
              informed decisions.
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-6 text-center mt-2">
          <img
            src="media/fintech_ecosystem.svg"
            alt="Ecosystem"
            className="img-fluid w-100 mb-4 state-image"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
          <div className="d-flex justify-content-center flex-wrap gap-3 active_links">
            <a href="/" className='mx-4'>
              Explore Our Products <i className="fa-solid fa-arrow-right ms-2"></i>
            </a>
            <a href="/" >
              Try Kit <i className="fa-solid fa-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
