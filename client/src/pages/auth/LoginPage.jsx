import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import './AuthPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__hero">
        <div className="auth-page__hero-content">
          <Link to="/" className="auth-page__logo">DataWill</Link>
          <h1 className="auth-page__title">
            Welcome<br /><em>back.</em>
          </h1>
          <p className="auth-page__subtitle">
            Your digital legacy is waiting. Sign in to continue managing your will.
          </p>
        </div>
      </div>

      <div className="auth-page__form-area">
        <div className="auth-page__form-wrapper">
          <h2 className="auth-page__form-title">Sign in</h2>
          <p className="auth-page__form-desc">
            Access your digital estate dashboard.
          </p>

          {error && <Alert variant="rose" title="Login failed">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              placeholder="arjun@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              full
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="auth-page__switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
