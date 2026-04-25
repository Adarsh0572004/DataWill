import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { checkInService } from '../../services/extraServices';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import './SettingsPage.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function SettingsPage() {
  const { user, token } = useAuth();
  const [checkIn, setCheckIn] = useState(null);
  const [frequency, setFrequency] = useState('monthly');
  const [success, setSuccess] = useState('');

  // Emergency PIN state
  const [hasPin, setHasPin] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    checkInService.getStatus().then(data => {
      setCheckIn(data);
      setFrequency(data.frequency);
    }).catch(() => {});

    // Check if user has emergency PIN
    fetch(`${API_BASE}/emergency/pin-status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setHasPin(data.hasPin))
      .catch(() => {});
  }, [token]);

  const handleFrequencyChange = async (e) => {
    const val = e.target.value;
    setFrequency(val);
    try {
      await checkInService.updateFrequency(val);
      setSuccess('Frequency updated.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const handleCheckIn = async () => {
    try {
      const data = await checkInService.performCheckIn();
      setCheckIn(data.checkIn);
      setSuccess('Check-in successful! You\'re confirmed alive.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const handleSetPin = async (e) => {
    e.preventDefault();
    setPinError('');

    if (!/^\d{6}$/.test(pin)) {
      setPinError('PIN must be exactly 6 digits');
      return;
    }
    if (pin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }

    setPinLoading(true);
    try {
      const res = await fetch(`${API_BASE}/emergency/set-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setHasPin(true);
      setPin('');
      setConfirmPin('');
      setSuccess('Emergency PIN set! Memorize it — don\'t write it down on your devices.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setPinError(err.message);
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <div className="settings-page animate-fade-in">
      <h1 className="text-h1">Settings</h1>
      <p className="text-caption" style={{ marginBottom: '1.5rem' }}>Manage your account and check-in preferences.</p>

      {success && <Alert variant="sage" title="Updated">{success}</Alert>}

      {/* Profile */}
      <h3 className="text-h3" style={{ margin: '1.5rem 0 0.8rem' }}>Profile</h3>
      <Card>
        <div className="settings-row">
          <div className="settings-row__label">Name</div>
          <div className="settings-row__value">{user?.name}</div>
        </div>
        <div className="settings-row">
          <div className="settings-row__label">Email</div>
          <div className="settings-row__value">{user?.email}</div>
        </div>
        <div className="settings-row">
          <div className="settings-row__label">Member since</div>
          <div className="settings-row__value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
        </div>
      </Card>

      {/* Check-In */}
      <h3 className="text-h3" style={{ margin: '1.5rem 0 0.8rem' }}>Check-In (Dead Man's Switch)</h3>
      <Card>
        <div className="settings-row">
          <div className="settings-row__label">Status</div>
          <div className="settings-row__value">
            <span className={`settings-status settings-status--${checkIn?.status || 'active'}`}>
              {checkIn?.status || 'Active'}
            </span>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row__label">Last check-in</div>
          <div className="settings-row__value">
            {checkIn?.lastCheckIn ? new Date(checkIn.lastCheckIn).toLocaleString() : '—'}
            {checkIn?.daysSince != null && <span className="text-caption" style={{ marginLeft: '8px' }}>({checkIn.daysSince} days ago)</span>}
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row__label">Frequency</div>
          <div className="settings-row__value">
            <select className="input-group__input" style={{ width: 'auto' }} value={frequency} onChange={handleFrequencyChange}>
              <option value="monthly">Monthly (every 30 days)</option>
              <option value="quarterly">Quarterly (every 90 days)</option>
            </select>
          </div>
        </div>
        <Button onClick={handleCheckIn} style={{ marginTop: '1rem' }}>✓ Check in now</Button>
      </Card>

      {/* Emergency PIN */}
      <h3 className="text-h3" style={{ margin: '1.5rem 0 0.8rem' }}>
        🛑 Emergency Cancel PIN
      </h3>
      <Card>
        <div className="settings-pin-header">
          <div>
            <p className="text-body-sm" style={{ marginBottom: '0.5rem' }}>
              Set a 6-digit PIN to cancel the death protocol from <strong>any device</strong> — even if you lose your phone and laptop.
            </p>
            <p className="text-caption">
              Go to <code style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px' }}>datawill.onrender.com/emergency</code> → enter email + PIN → protocol cancelled.
            </p>
          </div>
          <div className={`settings-pin-badge ${hasPin ? 'settings-pin-badge--active' : ''}`}>
            {hasPin ? '✅ PIN Set' : '⚠️ Not Set'}
          </div>
        </div>

        <form onSubmit={handleSetPin} style={{ marginTop: '1.25rem' }}>
          {pinError && <Alert variant="rose" title="Error">{pinError}</Alert>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="6-Digit PIN"
              type="password"
              placeholder="••••••"
              value={pin}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPin(v);
              }}
              required
            />
            <Input
              label="Confirm PIN"
              type="password"
              placeholder="••••••"
              value={confirmPin}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                setConfirmPin(v);
              }}
              required
            />
          </div>

          {/* Visual PIN dots */}
          <div className="settings-pin-dots">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className={`settings-pin-dot ${pin.length > i ? 'settings-pin-dot--filled' : ''}`} />
            ))}
            <span className="settings-pin-dots__label">
              {pin.length}/6 digits
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={pinLoading || pin.length !== 6 || pin !== confirmPin}
            style={{ marginTop: '0.5rem' }}
          >
            {pinLoading ? 'Setting...' : hasPin ? '🔄 Update PIN' : '🔐 Set Emergency PIN'}
          </Button>

          {hasPin && (
            <p className="text-caption" style={{ marginTop: '8px', color: 'var(--sage-dark)' }}>
              ✅ Your PIN is set. <strong>Memorize it</strong> — don't store it on your devices.
            </p>
          )}
        </form>
      </Card>

      {/* Danger Zone */}
      <h3 className="text-h3" style={{ margin: '1.5rem 0 0.8rem', color: 'var(--rose)' }}>Danger Zone</h3>
      <Card>
        <p className="text-body-sm" style={{ marginBottom: '0.75rem' }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="danger" disabled>Delete my account</Button>
      </Card>
    </div>
  );
}

export default SettingsPage;
