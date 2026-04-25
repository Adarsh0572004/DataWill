import { useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// Scroll-reveal hook
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function LandingPage() {
  return (
    <div className="landing">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        {/* Animated gradient orbs */}
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid-bg" />

        <div className="hero__inner container">
          <div className="hero__eyebrow animate-fade-in">
            <span className="hero__eyebrow-dot" />
            Digital estate planning, finally done right
          </div>

          <h1 className="hero__title animate-fade-in" style={{ animationDelay: '100ms' }}>
            Your digital life,<br />
            <span className="gradient-text">on your terms.</span>
          </h1>

          <p className="hero__body animate-fade-in" style={{ animationDelay: '200ms' }}>
            Register every account and credential you own. Set rules for each one. 
            If something happens to you, DataWill delivers your digital estate to your 
            loved ones — automatically and securely.
          </p>

          <div className="hero__btns animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link to="/register">
              <button className="btn-glow">
                Start for free
                <span className="btn-glow__shine" />
              </button>
            </Link>
            <a href="#how-it-works">
              <Button variant="dark-secondary">See how it works →</Button>
            </a>
          </div>

          {/* Feature Cards */}
          <div className="hero__features">
            {[
              { icon: '🔐', title: 'AES-256 Encrypted Vault', desc: 'Store account credentials encrypted at rest. Only decrypted when needed.' },
              { icon: '⚡', title: 'Automatic execution', desc: 'Miss 3 check-ins? Your digital estate is securely delivered to your family.' },
              { icon: '📧', title: 'Smart notifications', desc: 'Reminder emails, death protocol triggers, and full audit trail — automated.' },
            ].map((f, i) => (
              <div className="feature-card animate-fade-in" key={i} style={{ animationDelay: `${400 + i * 100}ms` }}>
                <div className="feature-card__icon">{f.icon}</div>
                <div className="feature-card__title">{f.title}</div>
                <div className="feature-card__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <RevealSection>
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Three steps to peace of mind.</h2>
            <p className="section-desc">
              DataWill makes digital estate planning simple, secure, and automatic. 
              No lawyers required.
            </p>
          </RevealSection>

          <div className="steps-grid">
            {[
              { num: '01', title: 'Register your assets', desc: 'Add your accounts with credentials. Everything is encrypted with AES-256 before storage.' },
              { num: '02', title: 'Write your rules', desc: 'Choose what happens: transfer credentials to a loved one, delete accounts, or send final messages.' },
              { num: '03', title: 'Set check-in frequency', desc: 'Check in monthly. Miss 3 in a row? DataWill emails your credentials to your trusted contacts.' },
            ].map((step, i) => (
              <RevealSection key={i} delay={i * 150}>
                <div className="step-card">
                  <div className="step-card__number">{step.num}</div>
                  <div className="step-card__line" />
                  <h3 className="step-card__title">{step.title}</h3>
                  <p className="step-card__desc">{step.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* The Flow Visual */}
      <section className="flow-section">
        <div className="container">
          <RevealSection>
            <div className="section-label">The Death Protocol</div>
            <h2 className="section-title">What happens when you're gone.</h2>
          </RevealSection>

          <div className="flow-timeline">
            {[
              { emoji: '✅', label: 'You check in', sublabel: 'Every 30 days', color: 'var(--sage-dark)' },
              { emoji: '⚠️', label: 'Missed check-in', sublabel: 'Reminder email sent', color: 'var(--gold)' },
              { emoji: '🚨', label: '3 misses', sublabel: 'Death protocol activates', color: 'var(--rose)' },
              { emoji: '📧', label: 'Credentials sent', sublabel: 'To your trusted contacts', color: 'var(--slate)' },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 200}>
                <div className="flow-step">
                  <div className="flow-step__dot" style={{ background: item.color }}>{item.emoji}</div>
                  {i < 3 && <div className="flow-step__connector" />}
                  <div className="flow-step__label">{item.label}</div>
                  <div className="flow-step__sublabel">{item.sublabel}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section" id="security">
        <div className="container">
          <RevealSection>
            <div className="section-label">Security</div>
            <h2 className="section-title">Built on zero-knowledge architecture.</h2>
            <p className="section-desc">
              Your credentials are encrypted client-side. Even under subpoena, 
              we cannot access your plaintext data.
            </p>
          </RevealSection>

          <div className="security-grid">
            {[
              { icon: '🔒', title: 'AES-256-GCM', desc: 'Military-grade encryption with authenticated tags. Every credential encrypted at rest.' },
              { icon: '🔑', title: 'Unique IV per entry', desc: 'Every encrypted value uses a random initialization vector. No two encrypted values look alike.' },
              { icon: '🛡️', title: 'Server-side only decryption', desc: 'Credentials only decrypted during death protocol execution. Never exposed in transit.' },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 150}>
                <div className="security-card">
                  <div className="security-card__icon">{item.icon}</div>
                  <h3 className="security-card__title">{item.title}</h3>
                  <p className="security-card__desc">{item.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <RevealSection>
            <h2 className="cta-section__title">
              Your legacy,<br /><span className="gradient-text">your rules.</span>
            </h2>
            <p className="cta-section__desc">
              Start building your digital will today. It's free.
            </p>
            <Link to="/register">
              <button className="btn-glow btn-glow--lg">
                Start your will
                <span className="btn-glow__shine" />
              </button>
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__logo">◆ DataWill</div>
          <div className="footer__links">
            <a href="#how-it-works">How it works</a>
            <a href="#security">Security</a>
            <Link to="/login">Sign in</Link>
          </div>
          <div className="footer__copy">© 2026 DataWill. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
