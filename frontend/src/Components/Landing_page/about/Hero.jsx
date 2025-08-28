import React from "react";

const Hero = () => {
  return (
    <>
      <section class="hero-section">
        <img
          src="media/about_page_svg_background.svg"
          alt="TrendSpotter Office"
          class="hero-background"
        />

        <div class="hero-content">
          <div class="container-custom">
            <div class="row">
              <div class="col-12">
                <h1 class="hero-title text-shadow-strong">
                  Tranquvest: Your Pulse on What's Next
                </h1>
                <p class="hero-description text-shadow-strong text-muted-white">
                  Stay ahead of the curve with tranquvest, your go-to source for
                  the latest trends and insights. We curate the most relevant
                  and engaging content to keep you informed and inspired.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="border-top mt-4 w-60 mx-auto "></div>
        </div>
      </div>
    </div>
    <div className="container py-4 mt-5">
  <div className="row">
    
    <div className="col-12 col-md-6 mb-4 mb-md-0">
      <div className="p-3">
        <p className="text-muted mb-3">
          <strong>Tranquvest</strong> is a modern online platform designed to simplify investing for everyone—from beginners to experienced traders. Our mission is to make financial growth accessible and trustworthy through smart tools and a seamless experience.
        </p>
        <p className="text-muted mb-3">
          We provide access to a wide range of investment options including stocks, mutual funds, ETFs, and more. Whether you want to grow wealth steadily or explore new investment opportunities, Tranquvest helps you make informed decisions with ease.
        </p>
        <p className="text-muted mb-3">
          Transparency, security, and user experience are at the core of everything we do. Our platform is built with the latest technologies and financial expertise to deliver a reliable and rewarding journey for our users.
        </p>
      </div>
    </div>


    <div className="col-12 col-md-6">
      <div className="p-3">
        <p className="text-muted mb-3">
          With powerful dashboards, live market tracking, and educational content, Tranquvest empowers you to take control of your financial future. All your assets, insights, and actions—together in one intuitive interface.
        </p>
        <p className="text-muted mb-3">
          Our customer support team is always here to help, ensuring that you have a smooth and guided experience no matter your skill level. We believe in growing together—your success is our mission.
        </p>
        <p className="text-muted mb-3">
          Join thousands of investors already using Tranquvest to achieve their financial goals. Start your journey today and experience trading redefined—simple, smart, and secure.
        </p>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default Hero;
