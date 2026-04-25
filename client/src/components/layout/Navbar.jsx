import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">◆</span>
          DataWill
        </Link>

        <ul className="navbar__links">
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#security">Security</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>

        <div className="navbar__cta">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="dark-secondary" size="sm">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Start your will</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
