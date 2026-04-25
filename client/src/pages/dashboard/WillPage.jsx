import { useState, useEffect } from 'react';
import { ruleService } from '../../services/ruleService';
import { assetService } from '../../services/assetService';
import { contactService } from '../../services/contactService';
import RuleCard from '../../components/ui/RuleCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import './WillPage.css';

function WillPage() {
  const [rules, setRules] = useState([]);
  const [assets, setAssets] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ assetId: '', action: 'transfer', beneficiaryId: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [r, a, c] = await Promise.all([
        ruleService.getAll(),
        assetService.getAll(),
        contactService.getAll()
      ]);
      setRules(r);
      setAssets(a);
      setContacts(c);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await ruleService.create(form);
      setSuccess('Rule added to your will.');
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this rule?')) return;
    try {
      await ruleService.remove(id);
      setSuccess('Rule removed.');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const ruledAssets = rules.length;
  const totalAssets = assets.length;
  const pct = totalAssets > 0 ? Math.round((ruledAssets / totalAssets) * 100) : 0;

  return (
    <div className="will-page animate-fade-in">
      <div className="will-page__header">
        <div>
          <h1 className="text-h1">My Will</h1>
          <p className="text-caption">{rules.length} rule{rules.length !== 1 ? 's' : ''} · {pct}% of assets covered</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => {
            const token = localStorage.getItem('datawill_token');
            fetch(`${import.meta.env.VITE_API_URL || '/api'}/will-pdf`, { headers: { Authorization: `Bearer ${token}` } })
              .then(res => res.blob())
              .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'DataWill_Summary.pdf'; a.click();
                URL.revokeObjectURL(url);
              })
              .catch(() => setError('Failed to generate PDF'));
          }}>↓ Download PDF</Button>
          <Button onClick={() => { setForm({ assetId: '', action: 'transfer', beneficiaryId: '', description: '' }); setShowModal(true); }}>
            + Add Rule
          </Button>
        </div>
      </div>

      {success && <Alert variant="sage" title="Success">{success}</Alert>}
      {error && <Alert variant="rose" title="Error">{error}</Alert>}

      {!loading && rules.length === 0 && (
        <div className="will-page__empty">
          <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📋</div>
          <h2 className="text-h2">No rules yet</h2>
          <p className="text-body" style={{ marginBottom: '1rem' }}>
            Define what happens to each of your digital assets.
          </p>
          <Button onClick={() => setShowModal(true)}>Write your first rule</Button>
        </div>
      )}

      <div className="will-page__list">
        {rules.map(rule => (
          <RuleCard
            key={rule._id}
            assetName={rule.assetId?.name || 'Unknown asset'}
            action={rule.action}
            description={rule.description}
            onDelete={() => handleDelete(rule._id)}
          />
        ))}
      </div>

      {/* Add Rule Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Add Rule</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-group__label">Asset</label>
                <select
                  className="input-group__input"
                  value={form.assetId}
                  onChange={e => setForm({ ...form, assetId: e.target.value })}
                  required
                >
                  <option value="">Select an asset...</option>
                  {assets.map(a => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-group__label">Action</label>
                <select
                  className="input-group__input"
                  value={form.action}
                  onChange={e => setForm({ ...form, action: e.target.value })}
                >
                  <option value="transfer">Transfer to beneficiary</option>
                  <option value="delete">Permanently delete</option>
                  <option value="archive">Archive (IPFS)</option>
                  <option value="memorialize">Memorialize</option>
                  <option value="schedule-message">Schedule message</option>
                </select>
              </div>
              {(form.action === 'transfer') && (
                <div className="input-group">
                  <label className="input-group__label">Beneficiary</label>
                  <select
                    className="input-group__input"
                    value={form.beneficiaryId}
                    onChange={e => setForm({ ...form, beneficiaryId: e.target.value })}
                  >
                    <option value="">Select a contact...</option>
                    {contacts.map(c => (
                      <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
              )}
              <Input
                label="Description"
                placeholder="Transfer full access to my daughter..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <Button type="submit" full style={{ marginTop: '0.5rem' }}>Add rule to will</Button>
            </form>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WillPage;
