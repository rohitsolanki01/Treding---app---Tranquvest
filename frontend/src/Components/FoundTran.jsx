import React from "react";

export default function FundTran() {
  return (
    <section className="py-5 bg-white border-top" id="fundtran">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">🔥 FundTran</h2>
          <p className="text-muted">
            A trending open-source developer project built to demonstrate
            scalable architecture, secure API handling, and modular design.
          </p>
        </div>

        {/* Key Features */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-light h-100">
              <h5 className="fw-bold text-primary">⚡ Fast & Modular</h5>
              <p className="text-muted">
                Designed with modular React components and clean code practices
                that developers can extend easily.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-light h-100">
              <h5 className="fw-bold text-success">🔐 Secure APIs</h5>
              <p className="text-muted">
                Backend APIs are built with Node.js + Express following modern
                security standards (JWT, dotenv, bcrypt).
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-light h-100">
              <h5 className="fw-bold text-warning">🌍 Scalable Design</h5>
              <p className="text-muted">
                Built to scale, showcasing developer-friendly patterns for
                managing large projects with MongoDB + Mongoose.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">🛠 Tech Stack</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Frontend: React + Bootstrap</li>
            <li className="list-group-item">
              Backend: Node.js, Express, REST APIs
            </li>
            <li className="list-group-item">Database: MongoDB + Mongoose</li>
            <li className="list-group-item">Authentication: JWT + bcrypt</li>
            <li className="list-group-item">Deployment: Vercel / Render</li>
          </ul>
        </div>

        {/* Roadmap */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">📌 Roadmap</h4>
          <ol className="list-group list-group-numbered">
            <li className="list-group-item">
              Initial Release – Core backend & UI setup
            </li>
            <li className="list-group-item">
              API Integrations – Secure endpoints for data handling
            </li>
            <li className="list-group-item">
              Dashboard – Developer insights & project stats
            </li>
            <li className="list-group-item">
              Open Source – Invite contributors & expand features
            </li>
          </ol>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-dark btn-lg shadow-sm"
          >
            ⭐ Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
