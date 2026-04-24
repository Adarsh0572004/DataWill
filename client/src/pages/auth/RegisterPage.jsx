import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import './AuthPage.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
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
            Create your<br /><em>legacy.</em>
          </h1>
          <p className="auth-page__subtitle">
            Your digital life should not outlive your intentions. Start building your digital will today.
          </p>
        </div>
      </div>

      <div className="auth-page__form-area">
        <div className="auth-page__form-wrapper">
          <h2 className="auth-page__form-title">Create your account</h2>
          <p className="auth-page__form-desc">
            Join thousands protecting their digital legacy.
          </p>

          {error && <Alert variant="rose" title="Registration failed">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Full name"
              placeholder="Arjun Mehta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              placeholder="Min 8 characters, 1 uppercase, 1 number"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="Must be at least 8 characters with 1 uppercase letter and 1 number."
              required
            />
            <Button
              type="submit"
              variant="primary"
              full
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="auth-page__switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
