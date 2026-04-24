import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assetService } from '../../services/assetService';
import { ruleService } from '../../services/ruleService';
import { contactService } from '../../services/contactService';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { checkInService } from '../../services/extraServices';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assets: 0, rules: 0, contacts: 0, needsRule: 0 });
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(null);
  const [checkInDone, setCheckInDone] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [assets, rules, contacts] = await Promise.all([
          assetService.getAll(),
          ruleService.getAll(),
          contactService.getAll()
        ]);
        const needsRule = assets.filter(a => a.status === 'needs-rule').length;
        setStats({
          assets: assets.length,
          rules: rules.length,
          contacts: contacts.length,
          needsRule
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    checkInService.getStatus().then(setCheckIn).catch(() => {});
  }, []);

  const handleCheckIn = async () => {
    try {
      const data = await checkInService.performCheckIn();
      setCheckIn(data.checkIn);
      setCheckInDone(true);
      setTimeout(() => setCheckInDone(false), 3000);
    } catch (err) { console.error(err); }
  };

  const completionItems = [
    { label: 'Connect primary accounts', done: stats.assets > 0 },
    { label: 'Add trusted contacts', done: stats.contacts > 0 },
    { label: 'Write rules for your assets', done: stats.rules > 0 },
    { label: 'Complete all asset rules', done: stats.needsRule === 0 && stats.assets > 0 },
  ];

  const completedCount = completionItems.filter(i => i.done).length;
  const completionPct = Math.round((completedCount / completionItems.length) * 100);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <h1 className="dashboard-page__greeting">
        {greeting()}, {user?.name?.split(' ')[0] || 'there'}.
      </h1>
      <p className="dashboard-page__subtitle">
        Your will is {completionPct}% complete.
        {stats.needsRule > 0 && ` ${stats.needsRule} asset${stats.needsRule > 1 ? 's' : ''} still need${stats.needsRule === 1 ? 's' : ''} rules.`}
      </p>

      {/* Progress bar */}
      <div className="dashboard-page__progress">
        <div
          className="dashboard-page__progress-fill"
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid-4 dashboard-page__stats">
        <StatCard value={loading ? '—' : stats.assets} label="Assets" />
        <StatCard value={loading ? '—' : stats.rules} label="Rules" />
        <StatCard value={loading ? '—' : stats.contacts} label="Contacts" color="var(--sage-2)" />
        <StatCard value={loading ? '—' : stats.needsRule} label="Need rules" color="var(--gold)" />
      </div>

      {/* Onboarding checklist */}
      <h3 className="text-h3" style={{ margin: '1.5rem 0 0.8rem' }}>Setup Checklist</h3>
      <div className="dashboard-page__checklist">
        {completionItems.map((item, idx) => (
          <div key={idx} className="checklist-item">
            <div className={`checklist-item__circle ${item.done ? 'checklist-item__circle--done' : ''}`}>
              {item.done ? '✓' : ''}
            </div>
            <span className={item.done ? '' : 'checklist-item--pending'}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Check-in card */}
      <h3 className="text-h3" style={{ margin: '1.5rem 0 0.8rem' }}>Check-In Status</h3>
      {checkInDone && <Alert variant="sage" title="You're confirmed alive!">Check-in recorded successfully.</Alert>}
      {checkIn?.status === 'overdue' && !checkInDone && (
        <Alert variant="gold" title="Overdue!">You haven't checked in for {checkIn.daysSince} days. Check in now to confirm you're okay.</Alert>
      )}
      <div className="dashboard-page__checkin-card">
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500 }}>Last check-in</div>
          <div className="text-caption">
            {checkIn?.lastCheckIn ? `${new Date(checkIn.lastCheckIn).toLocaleDateString()} (${checkIn.daysSince} days ago)` : 'Never'}
            {' · '}
            <span style={{ textTransform: 'capitalize' }}>{checkIn?.frequency || 'monthly'}</span>
          </div>
        </div>
        <Button onClick={handleCheckIn}>✓ Check in now</Button>
      </div>
    </div>
  );
}

export default DashboardPage;
