import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">DataWill</Link>

        <ul className="navbar__links">
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#security">Security</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>

        <div className="navbar__cta">
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
