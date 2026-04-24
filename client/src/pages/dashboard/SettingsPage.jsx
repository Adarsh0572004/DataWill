import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { checkInService } from '../../services/extraServices';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import './SettingsPage.css';

function SettingsPage() {
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState(null);
  const [frequency, setFrequency] = useState('monthly');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkInService.getStatus().then(data => {
      setCheckIn(data);
      setFrequency(data.frequency);
    }).catch(() => {});
  }, []);

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
