import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="py-5 bg-light" id="privacy-policy">
      <div className="container">
        <h1 className="fw-bold text-dark mb-4">Privacy Policy</h1>
        <p className="text-muted">
          At <strong>Tranquvest</strong>, your privacy is our top priority. This
          Privacy Policy explains how we collect, use, and safeguard your
          information when you use our platform.
        </p>

        {/* Section 1 */}
        <div className="mb-4">
          <h5 className="fw-bold">1. Information We Collect</h5>
          <ul className="text-muted">
            <li>Personal information (name, email, phone number).</li>
            <li>Account details and authentication data.</li>
            <li>Usage data (IP address, browser type, device info).</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-4">
          <h5 className="fw-bold">2. How We Use Your Information</h5>
          <ul className="text-muted">
            <li>To provide and improve our services.</li>
            <li>To maintain security and prevent fraud.</li>
            <li>To communicate updates, features, and offers.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-4">
          <h5 className="fw-bold">3. Data Protection</h5>
          <p className="text-muted">
            All sensitive data is encrypted and securely stored. We use
            industry-standard security protocols including HTTPS, JWT, and
            database encryption.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-4">
          <h5 className="fw-bold">4. Sharing of Data</h5>
          <p className="text-muted">
            We do not sell or rent your data. Information may only be shared
            with trusted third parties required to operate the platform (e.g.,
            payment gateways, hosting providers).
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-4">
          <h5 className="fw-bold">5. Your Rights</h5>
          <ul className="text-muted">
            <li>Access, update, or delete your account data.</li>
            <li>Opt-out of marketing communications.</li>
            <li>Request a copy of your stored information.</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="mb-4">
          <h5 className="fw-bold">6. Updates to Policy</h5>
          <p className="text-muted">
            We may update this Privacy Policy from time to time. All updates
            will be posted on this page with a revised date.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <h5 className="fw-bold">7. Contact Us</h5>
          <p className="text-muted">
            If you have any questions about this Privacy Policy, reach out at:{" "}
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
