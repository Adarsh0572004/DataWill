import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import './EmergencyPage.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function EmergencyPage() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/emergency/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to cancel');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emergency-page">
      <div className="emergency-page__bg">
        <div className="emergency-page__orb emergency-page__orb--1" />
        <div className="emergency-page__orb emergency-page__orb--2" />
      </div>

      <div className="emergency-page__card">
        <div className="emergency-page__icon">🛑</div>
        <h1 className="emergency-page__title">Emergency Cancel</h1>
        <p className="emergency-page__desc">
          If you are alive and your death protocol has been triggered by mistake, 
          enter your email and 6-digit emergency PIN to cancel it immediately.
        </p>

        {result ? (
          <div className="emergency-page__success">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: 'var(--sage-dark)', marginBottom: '8px' }}>Protocol Cancelled!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your credentials are safe. Check-in timer has been reset.
            </p>
            <Link to="/dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCancel}>
            {error && <Alert variant="rose" title="Error">{error}</Alert>}
            
            <Input
              label="Email address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="6-Digit Emergency PIN"
              type="text"
              placeholder="000000"
              value={pin}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPin(v);
              }}
              required
            />

            <div className="emergency-page__pin-dots">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className={`emergency-page__dot ${pin.length > i ? 'emergency-page__dot--filled' : ''}`} />
              ))}
            </div>

            <Button type="submit" variant="danger" full disabled={loading || pin.length !== 6}>
              {loading ? 'Cancelling...' : '🛑 Cancel Death Protocol'}
            </Button>
          </form>
        )}

        <div className="emergency-page__footer">
          <p>Don't have a PIN? <Link to="/login" style={{ color: 'var(--sage-dark)' }}>Log in</Link> to set one in Settings.</p>
          <p><Link to="/" style={{ color: 'var(--text-muted)' }}>← Back to DataWill</Link></p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyPage;
