import React from "react";

export default function Disclaimer() {
  return (
    <section className="py-5 bg-white" id="disclaimer">
      <div className="container">
        <h1 className="fw-bold text-dark mb-4">Disclaimer</h1>
        <p className="text-muted">
          The information provided on <strong>Tranquvest</strong> is for
          educational and informational purposes only. We do not provide
          financial, investment, or trading advice. All content, including
          market data, strategies, and examples, is shared to help users
          understand trading concepts better.
        </p>

        {/* Risk Warning */}
        <div className="mb-4">
          <h5 className="fw-bold">1. Risk Warning</h5>
          <p className="text-muted">
            Trading and investing in financial markets involves significant risk
            of loss and is not suitable for all investors. Past performance is
            not indicative of future results. You should carefully consider your
            financial situation and consult a licensed financial advisor before
            making any investment decisions.
          </p>
        </div>

        {/* No Guarantees */}
        <div className="mb-4">
          <h5 className="fw-bold">2. No Guarantees</h5>
          <p className="text-muted">
            <strong>Tranquvest</strong> makes no guarantees regarding the
            accuracy, completeness, or reliability of the information provided
            on this website. Any reliance you place on such information is
            strictly at your own risk.
          </p>
        </div>

        {/* Third-Party Links */}
        <div className="mb-4">
          <h5 className="fw-bold">3. Third-Party Links</h5>
          <p className="text-muted">
            Our platform may contain links to third-party websites or services.
            We are not responsible for the content, policies, or practices of
            external sites.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div className="mb-4">
          <h5 className="fw-bold">4. Limitation of Liability</h5>
          <p className="text-muted">
            <strong>Tranquvest</strong> and its team will not be held liable for
            any direct, indirect, or consequential losses resulting from the use
            of this website or reliance on any information provided herein.
          </p>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <h5 className="fw-bold">5. Contact Us</h5>
          <p className="text-muted">
            For any concerns regarding this Disclaimer, please contact us at:{" "}
            <a href="mailto:rohitsolanki0473@gmail.com">
              rohitsolanki0473@gmail.com
            </a>
          </p>
        </div>

        <p className="text-secondary small">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
}
