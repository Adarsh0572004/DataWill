import { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import Card from '../../components/ui/Card';
import './ContactsPage.css';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'beneficiary', relationship: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchContacts = async () => {
    try { setContacts(await contactService.getAll()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await contactService.create(form);
      setSuccess('Contact added.');
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', role: 'beneficiary', relationship: '' });
      fetchContacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this contact?')) return;
    try {
      await contactService.remove(id);
      setSuccess('Contact removed.');
      fetchContacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
  };

  const roleLabels = { 'trusted-contact': 'Trusted Contact', beneficiary: 'Beneficiary', both: 'Trusted + Beneficiary' };

  return (
    <div className="contacts-page animate-fade-in">
      <div className="contacts-page__header">
        <div>
          <h1 className="text-h1">Trusted Contacts</h1>
          <p className="text-caption">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Add Contact</Button>
      </div>

      {success && <Alert variant="sage" title="Success">{success}</Alert>}
      {error && <Alert variant="rose" title="Error">{error}</Alert>}

      {!loading && contacts.length === 0 && (
        <div className="contacts-page__empty">
          <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>👤</div>
          <h2 className="text-h2">No contacts yet</h2>
          <p className="text-body" style={{ marginBottom: '1rem' }}>Add trusted contacts who can verify your death and beneficiaries who will inherit your assets.</p>
          <Button onClick={() => setShowModal(true)}>Add your first contact</Button>
        </div>
      )}

      <div className="grid-2 contacts-page__grid">
        {contacts.map(c => (
          <Card key={c._id} hover className="contact-card">
            <div className="contact-card__top">
              <div className="contact-card__avatar">{c.name.charAt(0).toUpperCase()}</div>
              <div className="contact-card__info">
                <div className="contact-card__name">{c.name}</div>
                <div className="contact-card__email">{c.email}</div>
              </div>
            </div>
            <div className="contact-card__meta">
              <Badge variant={c.role === 'trusted-contact' || c.role === 'both' ? 'sage' : 'slate'} dot>
                {roleLabels[c.role]}
              </Badge>
              {c.relationship && <span className="text-caption">{c.relationship}</span>}
            </div>
            <button className="contact-card__delete" onClick={() => handleDelete(c._id)}>Remove</button>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Add Contact</h2>
            <form onSubmit={handleSubmit}>
              <Input label="Full name" placeholder="Meera Mehta" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <Input label="Email" type="email" placeholder="meera@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <Input label="Phone (optional)" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <div className="input-group">
                <label className="input-group__label">Role</label>
                <select className="input-group__input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="beneficiary">Beneficiary</option>
                  <option value="trusted-contact">Trusted Contact</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <Input label="Relationship" placeholder="Daughter, Spouse, Friend..." value={form.relationship} onChange={e => setForm({...form, relationship: e.target.value})} />
              <Button type="submit" full style={{ marginTop: '0.5rem' }}>Add contact</Button>
            </form>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsPage;
