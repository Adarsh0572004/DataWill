import { useState, useEffect } from 'react';
import { messageService } from '../../services/extraServices';
import { contactService } from '../../services/contactService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import './MessagesPage.css';

const SCHEDULE_LABELS = {
  'immediately': 'Immediately after execution',
  '1-week': '1 week after',
  '1-month': '1 month after',
  '6-months': '6 months after',
  '1-year': '1 year after',
  'custom': 'Custom date'
};

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ recipientContactId: '', subject: '', body: '', deliverySchedule: 'immediately', status: 'scheduled' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [m, c] = await Promise.all([messageService.getAll(), contactService.getAll()]);
      setMessages(m);
      setContacts(c);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await messageService.create(form);
      setSuccess('Message scheduled.');
      setShowModal(false);
      setForm({ recipientContactId: '', subject: '', body: '', deliverySchedule: 'immediately', status: 'scheduled' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scheduled message?')) return;
    try {
      await messageService.remove(id);
      setSuccess('Message deleted.');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="messages-page animate-fade-in">
      <div className="messages-page__header">
        <div>
          <h1 className="text-h1">Messages</h1>
          <p className="text-caption">{messages.length} scheduled message{messages.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Compose</Button>
      </div>

      {success && <Alert variant="sage" title="Success">{success}</Alert>}
      {error && <Alert variant="rose" title="Error">{error}</Alert>}

      {!loading && messages.length === 0 && (
        <div className="messages-page__empty">
          <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>✉️</div>
          <h2 className="text-h2">No messages yet</h2>
          <p className="text-body" style={{ marginBottom: '1rem' }}>Write messages to be delivered to loved ones after your passing.</p>
          <Button onClick={() => setShowModal(true)}>Compose your first message</Button>
        </div>
      )}

      <div className="messages-page__list">
        {messages.map(msg => (
          <Card key={msg._id} hover className="message-card">
            <div className="message-card__top">
              <div>
                <div className="message-card__subject">{msg.subject}</div>
                <div className="text-caption">To: {msg.recipientContactId?.name || 'Unknown'} · {SCHEDULE_LABELS[msg.deliverySchedule] || msg.deliverySchedule}</div>
              </div>
              <Badge variant={msg.status === 'scheduled' ? 'sage' : 'slate'} dot>{msg.status}</Badge>
            </div>
            {msg.body && <div className="message-card__body">{msg.body.substring(0, 120)}{msg.body.length > 120 ? '...' : ''}</div>}
            <button className="message-card__delete" onClick={() => handleDelete(msg._id)}>Delete</button>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Compose Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-group__label">Recipient</label>
                <select className="input-group__input" value={form.recipientContactId} onChange={e => setForm({ ...form, recipientContactId: e.target.value })} required>
                  <option value="">Select a contact...</option>
                  {contacts.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                </select>
              </div>
              <Input label="Subject" placeholder="A letter for you..." value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              <div className="input-group">
                <label className="input-group__label">Message</label>
                <textarea className="input-group__input" rows={5} placeholder="Dear..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div className="input-group">
                <label className="input-group__label">Delivery Schedule</label>
                <select className="input-group__input" value={form.deliverySchedule} onChange={e => setForm({ ...form, deliverySchedule: e.target.value })}>
                  {Object.entries(SCHEDULE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <Button type="submit" full style={{ marginTop: '0.5rem' }}>Schedule message</Button>
            </form>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagesPage;
