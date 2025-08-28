import React, { useState, useEffect } from 'react';
import '../index.css';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('');
  const [lastUpdated] = useState('August 27, 2025');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.terms-section');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: '📋' },
    { id: 'acceptance', title: 'Acceptance of Terms', icon: '✅' },
    { id: 'definitions', title: 'Definitions', icon: '📖' },
    { id: 'user-accounts', title: 'User Accounts', icon: '👤' },
    { id: 'trading-services', title: 'Trading Services', icon: '📈' },
    { id: 'risk-disclosure', title: 'Risk Disclosure', icon: '⚠️' },
    { id: 'user-conduct', title: 'User Conduct', icon: '🛡️' },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: '©️' },
    { id: 'privacy-data', title: 'Privacy & Data', icon: '🔒' },
    { id: 'fees-payments', title: 'Fees & Payments', icon: '💳' },
    { id: 'termination', title: 'Termination', icon: '🚫' },
    { id: 'disclaimers', title: 'Disclaimers', icon: '📢' },
    { id: 'limitation-liability', title: 'Limitation of Liability', icon: '⚖️' },
    { id: 'governing-law', title: 'Governing Law', icon: '🏛️' },
    { id: 'dispute-resolution', title: 'Dispute Resolution', icon: '🤝' },
    { id: 'changes', title: 'Changes to Terms', icon: '🔄' },
    { id: 'contact', title: 'Contact Information', icon: '📞' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="terms-container">
      {/* Header */}
      <div className="terms-header">
        <div className="header-content">
          <h1 className="terms-title">Terms & Conditions</h1>
          <p className="terms-subtitle">
            Please read these terms and conditions carefully before using Tranquvest's trading platform and services.
          </p>
          <div className="terms-meta">
            <span className="last-updated">Last Updated: {lastUpdated}</span>
            <span className="effective-date">Effective Date: {lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="terms-layout">
        {/* Table of Contents */}
        <div className="terms-sidebar">
          <div className="sidebar-sticky">
            <h3 className="sidebar-title">Table of Contents</h3>
            <nav className="terms-nav">
              {sections.map(section => (
                <button
                  key={section.id}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(section.id)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-text">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="terms-content">
          {/* Introduction */}
          <section id="introduction" className="terms-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Tranquvest ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our trading platform, website, and services (collectively, the "Service") operated by Tranquvest.
            </p>
            <p>
              Tranquvest is a financial technology platform that provides trading tools, market analysis, and educational resources for individual investors and traders. Our mission is to democratize access to financial markets while promoting responsible trading practices.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section id="acceptance" className="terms-section">
            <h2>2. Acceptance of Terms</h2>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
            </p>
            <div className="important-notice">
              <h4>🚨 Important Notice</h4>
              <p>
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </div>
          </section>

          {/* Definitions */}
          <section id="definitions" className="terms-section">
            <h2>3. Definitions</h2>
            <div className="definitions-list">
              <div className="definition-item">
                <strong>"Account"</strong> means your registered user account on the Tranquvest platform.
              </div>
              <div className="definition-item">
                <strong>"Content"</strong> means any information, data, text, software, music, sound, photographs, graphics, video, messages, or other materials.
              </div>
              <div className="definition-item">
                <strong>"Trading"</strong> means the buying and selling of financial instruments through our platform.
              </div>
              <div className="definition-item">
                <strong>"User"</strong> means any individual who creates an account or uses our Service.
              </div>
              <div className="definition-item">
                <strong>"Financial Instruments"</strong> means stocks, bonds, derivatives, cryptocurrencies, and other securities available on our platform.
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section id="user-accounts" className="terms-section">
            <h2>4. User Accounts</h2>
            <h3>4.1 Account Registration</h3>
            <p>
              To use certain features of our Service, you must register for an account. When you create an account, you must provide information that is accurate, complete, and current at all times.
            </p>
            
            <h3>4.2 Account Security</h3>
            <ul>
              <li>You are responsible for safeguarding the password and all activities under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>You may not use another person's account without permission</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>

            <h3>4.3 Eligibility Requirements</h3>
            <ul>
              <li>You must be at least 18 years old to create an account</li>
              <li>You must be legally authorized to trade in your jurisdiction</li>
              <li>You must comply with all applicable laws and regulations</li>
              <li>You cannot be located in a restricted jurisdiction</li>
            </ul>
          </section>

          {/* Trading Services */}
          <section id="trading-services" className="terms-section">
            <h2>5. Trading Services</h2>
            <h3>5.1 Platform Features</h3>
            <p>
              Tranquvest provides access to financial markets through our trading platform, including:
            </p>
            <ul>
              <li>Real-time market data and analysis tools</li>
              <li>Order execution capabilities</li>
              <li>Portfolio management features</li>
              <li>Educational resources and market insights</li>
              <li>Risk management tools</li>
            </ul>

            <h3>5.2 Trading Execution</h3>
            <p>
              All trades are subject to market conditions and availability. We do not guarantee execution of any order and are not responsible for market movements or technical issues that may affect your trades.
            </p>

            <h3>5.3 Market Data</h3>
            <p>
              Market data provided on our platform is for informational purposes only and may be delayed. We are not responsible for the accuracy or completeness of market data.
            </p>
          </section>

          {/* Risk Disclosure */}
          <section id="risk-disclosure" className="terms-section">
            <h2>6. Risk Disclosure</h2>
            <div className="risk-warning">
              <h4>⚠️ IMPORTANT RISK WARNING</h4>
              <p>
                Trading financial instruments involves substantial risk and may not be suitable for all investors. You should carefully consider your investment objectives, level of experience, and risk appetite before trading.
              </p>
            </div>

            <h3>6.1 General Risks</h3>
            <ul>
              <li><strong>Market Risk:</strong> Prices of financial instruments can fluctuate significantly</li>
              <li><strong>Liquidity Risk:</strong> You may not be able to buy or sell when desired</li>
              <li><strong>Leverage Risk:</strong> Leveraged trading can amplify both gains and losses</li>
              <li><strong>Technology Risk:</strong> Technical failures may affect your ability to trade</li>
              <li><strong>Regulatory Risk:</strong> Changes in regulations may impact your investments</li>
            </ul>

            <h3>6.2 Cryptocurrency Risks</h3>
            <ul>
              <li>Extreme price volatility</li>
              <li>Regulatory uncertainty</li>
              <li>Limited adoption and liquidity</li>
              <li>Technology and security risks</li>
            </ul>

            <div className="disclaimer-box">
              <p>
                <strong>Past performance is not indicative of future results.</strong> You should never invest money you cannot afford to lose.
              </p>
            </div>
          </section>

          {/* User Conduct */}
          <section id="user-conduct" className="terms-section">
            <h2>7. User Conduct</h2>
            <h3>7.1 Prohibited Activities</h3>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul>
              <li>Market manipulation or insider trading</li>
              <li>Using the platform for money laundering or other illegal activities</li>
              <li>Attempting to gain unauthorized access to other accounts</li>
              <li>Interfering with the proper operation of the platform</li>
              <li>Sharing false or misleading information</li>
              <li>Using automated trading systems without permission</li>
            </ul>

            <h3>7.2 Compliance Requirements</h3>
            <p>
              You must comply with all applicable laws, regulations, and industry standards in your jurisdiction, including but not limited to securities laws, anti-money laundering regulations, and tax obligations.
            </p>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual-property" className="terms-section">
            <h2>8. Intellectual Property</h2>
            <h3>8.1 Our Rights</h3>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Tranquvest and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>

            <h3>8.2 Limited License</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and use our Service for your personal, non-commercial use, subject to these Terms.
            </p>

            <h3>8.3 User Content</h3>
            <p>
              By posting content on our platform, you grant us a worldwide, royalty-free license to use, reproduce, and display such content in connection with our Service.
            </p>
          </section>

          {/* Privacy & Data */}
          <section id="privacy-data" className="terms-section">
            <h2>9. Privacy & Data Protection</h2>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.
            </p>
            
            <h3>9.1 Data Collection</h3>
            <ul>
              <li>Personal information for account verification</li>
              <li>Trading activity and transaction history</li>
              <li>Device and usage information</li>
              <li>Communication preferences</li>
            </ul>

            <h3>9.2 Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.
            </p>
          </section>

          {/* Fees & Payments */}
          <section id="fees-payments" className="terms-section">
            <h2>10. Fees & Payments</h2>
            <h3>10.1 Trading Fees</h3>
            <p>
              We may charge fees for certain services, including trading commissions, subscription fees, and data fees. All applicable fees will be clearly disclosed before you incur them.
            </p>

            <h3>10.2 Payment Methods</h3>
            <p>
              We accept various payment methods as specified on our platform. You are responsible for all fees charged by third-party payment processors.
            </p>

            <h3>10.3 Fee Changes</h3>
            <p>
              We reserve the right to change our fee structure with 30 days' notice to users.
            </p>
          </section>

          {/* Termination */}
          <section id="termination" className="terms-section">
            <h2>11. Termination</h2>
            <h3>11.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by contacting our customer support or using the account closure feature in your dashboard.
            </p>

            <h3>11.2 Termination by Us</h3>
            <p>
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>

            <h3>11.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to use the Service will cease immediately. You remain liable for all outstanding obligations.
            </p>
          </section>

          {/* Disclaimers */}
          <section id="disclaimers" className="terms-section">
            <h2>12. Disclaimers</h2>
            <div className="disclaimer-box">
              <h4>12.1 Service Availability</h4>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
              </p>
            </div>

            <h3>12.2 Investment Advice</h3>
            <p>
              We do not provide investment advice. All content on our platform is for informational purposes only and should not be considered as financial advice.
            </p>

            <h3>12.3 Third-Party Services</h3>
            <p>
              Our Service may contain links to third-party websites or services. We are not responsible for the content or practices of these third parties.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section id="limitation-liability" className="terms-section">
            <h2>13. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Tranquvest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
            </p>
            
            <h3>13.1 Maximum Liability</h3>
            <p>
              Our total liability to you for all damages shall not exceed the amount you paid to us in the 12 months preceding the event giving rise to liability.
            </p>

            <h3>13.2 Exceptions</h3>
            <p>
              Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for consequential damages, so the above limitations may not apply to you.
            </p>
          </section>

          {/* Governing Law */}
          <section id="governing-law" className="terms-section">
            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
            
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section id="dispute-resolution" className="terms-section">
            <h2>15. Dispute Resolution</h2>
            <h3>15.1 Informal Resolution</h3>
            <p>
              Before filing a formal dispute, we encourage you to contact us directly to seek a resolution.
            </p>

            <h3>15.2 Arbitration</h3>
            <p>
              Any disputes arising out of or relating to these Terms or the Service will be resolved through binding arbitration, except where prohibited by law.
            </p>

            <h3>15.3 Class Action Waiver</h3>
            <p>
              You agree that any arbitration will be conducted on an individual basis and not as part of a class action.
            </p>
          </section>

          {/* Changes to Terms */}
          <section id="changes" className="terms-section">
            <h2>16. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            
            <p>
              Your continued use of the Service after we post any modifications to the Terms constitutes acceptance of those changes.
            </p>

            <div className="notification-box">
              <h4>📧 Stay Informed</h4>
              <p>
                We recommend checking this page periodically for changes. We will also notify you via email of any significant updates.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact" className="terms-section">
            <h2>17. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            
            <div className="contact-info">
              <div className="contact-item">
                <strong>📧 Email:</strong>
                <span>legal@tranquvest.com</span>
              </div>
              <div className="contact-item">
                <strong>📞 Phone:</strong>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <strong>📍 Address:</strong>
                <span>123 Trading Street, Financial District, NY 10001</span>
              </div>
              <div className="contact-item">
                <strong>🌐 Website:</strong>
                <span>www.tranquvest.com</span>
              </div>
            </div>

            <div className="final-note">
              <p>
                Thank you for choosing Tranquvest. We're committed to providing you with a secure, reliable, and innovative trading experience.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑ Back to Top
      </button>
    </div>
  );
};

export default TermsAndConditions;
