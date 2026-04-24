import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__inner container">
          <div className="hero__eyebrow">Digital estate planning, finally done right</div>
          <h1 className="hero__title">
            Your digital life,<br /><em>on your terms.</em>
          </h1>
          <p className="hero__body">
            Register every account, file, and asset you own. Write rules for each one. 
            DataWill executes them exactly as intended — automatically, cryptographically, 
            and privately.
          </p>
          <div className="hero__btns">
            <Link to="/register">
              <Button variant="dark">Start for free</Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="dark-secondary">See how it works →</Button>
            </a>
          </div>

          {/* Feature Cards */}
          <div className="hero__features grid-3">
            <div className="feature-card">
              <div className="feature-card__icon">🔐</div>
              <div className="feature-card__title">Zero-knowledge encrypted</div>
              <div className="feature-card__desc">
                Your will contents are never readable by DataWill staff. Encrypted client-side.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">⚡</div>
              <div className="feature-card__title">Automatic execution</div>
              <div className="feature-card__desc">
                Rules run the moment death is verified. No family intervention required.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🤖</div>
              <div className="feature-card__title">AI training opt-out</div>
              <div className="feature-card__desc">
                The only platform with enforceable post-mortem AI consent controls.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="text-section-label">How It Works</div>
          <h2 className="text-h2" style={{ marginBottom: '0.5rem' }}>Three steps to peace of mind.</h2>
          <p className="text-body" style={{ marginBottom: '2rem', maxWidth: '520px' }}>
            DataWill makes digital estate planning simple, secure, and automatic. 
            No lawyers required for setup.
          </p>
          <div className="grid-3">
            <Card hover>
              <div className="step-number">01</div>
              <h3 className="text-h4" style={{ marginBottom: '0.5rem' }}>Register your assets</h3>
              <p className="text-body-sm">
                Connect accounts via OAuth or manually add assets like crypto wallets, 
                domains, and subscriptions.
              </p>
            </Card>
            <Card hover>
              <div className="step-number">02</div>
              <h3 className="text-h4" style={{ marginBottom: '0.5rem' }}>Write your rules</h3>
              <p className="text-body-sm">
                For each asset, choose: transfer to a loved one, permanently delete, 
                archive, or schedule a message.
              </p>
            </Card>
            <Card hover>
              <div className="step-number">03</div>
              <h3 className="text-h4" style={{ marginBottom: '0.5rem' }}>Set trusted contacts</h3>
              <p className="text-body-sm">
                Designate 2–3 people who can verify your death and trigger execution. 
                No single person has full control.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section" id="security">
        <div className="container">
          <div className="text-section-label">Security</div>
          <h2 className="text-h2" style={{ marginBottom: '0.5rem' }}>
            Built on zero-knowledge architecture.
          </h2>
          <p className="text-body" style={{ marginBottom: '2rem', maxWidth: '520px' }}>
            DataWill can never read your will. Your data is encrypted client-side with keys 
            you control. Even under subpoena, we cannot access your plaintext instructions.
          </p>
          <div className="grid-3">
            <Card variant="small">
              <h3 className="text-h3" style={{ marginBottom: '0.4rem' }}>AES-256 Encryption</h3>
              <p className="text-body-sm" style={{ fontSize: '12px' }}>
                All will contents encrypted at rest. TLS 1.3 in transit.
              </p>
            </Card>
            <Card variant="small">
              <h3 className="text-h3" style={{ marginBottom: '0.4rem' }}>Multi-Party Key Recovery</h3>
              <p className="text-body-sm" style={{ fontSize: '12px' }}>
                Your key is split via Shamir's Secret Sharing across trusted contacts. 2-of-3 quorum required.
              </p>
            </Card>
            <Card variant="small">
              <h3 className="text-h3" style={{ marginBottom: '0.4rem' }}>72h Challenge Window</h3>
              <p className="text-body-sm" style={{ fontSize: '12px' }}>
                False trigger protection. You can cancel from any device during the challenge period.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="cta-section__title">
            Your legacy,<br /><em>your rules.</em>
          </h2>
          <p className="cta-section__desc">
            Start building your digital will today. It's free to begin.
          </p>
          <Link to="/register">
            <Button variant="dark" size="lg">Start your will</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__logo">DataWill</div>
          <div className="footer__links">
            <a href="#how-it-works">How it works</a>
            <a href="#security">Security</a>
            <Link to="/login">Sign in</Link>
          </div>
          <div className="footer__copy">© 2025 DataWill. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
