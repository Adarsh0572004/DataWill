import { useState, useEffect } from 'react';
import { assetService } from '../../services/assetService';
import AssetCard from '../../components/ui/AssetCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import './AssetsPage.css';

const ICON_MAP = {
  social: '🐦', storage: '☁️', financial: '💰',
  creative: '🎨', communication: '📧', other: '📦'
};

function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [form, setForm] = useState({ name: '', platform: '', type: 'other' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAssets = async () => {
    try {
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  const openAdd = () => {
    setEditAsset(null);
    setForm({ name: '', platform: '', type: 'other' });
    setShowModal(true);
  };

  const openEdit = (asset) => {
    setEditAsset(asset);
    setForm({ name: asset.name, platform: asset.platform, type: asset.type });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = { ...form, icon: ICON_MAP[form.type] || '📦' };
      if (editAsset) {
        await assetService.update(editAsset._id, data);
        setSuccess('Asset updated.');
      } else {
        await assetService.create(data);
        setSuccess('Asset added to registry.');
      }
      setShowModal(false);
      fetchAssets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this asset? This action cannot be undone.')) return;
    try {
      await assetService.remove(id);
      setSuccess('Asset removed.');
      fetchAssets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="assets-page animate-fade-in">
      <div className="assets-page__header">
        <div>
          <h1 className="text-h1">Asset Registry</h1>
          <p className="text-caption">{assets.length} asset{assets.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Button onClick={openAdd}>+ Add Asset</Button>
      </div>

      {success && <Alert variant="sage" title="Success">{success}</Alert>}
      {error && <Alert variant="rose" title="Error">{error}</Alert>}

      {!loading && assets.length === 0 && (
        <div className="assets-page__empty">
          <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📦</div>
          <h2 className="text-h2">No assets yet</h2>
          <p className="text-body" style={{ marginBottom: '1rem' }}>
            Start by registering your digital accounts, files, and assets.
          </p>
          <Button onClick={openAdd}>Add your first asset</Button>
        </div>
      )}

      <div className="grid-2 assets-page__grid">
        {assets.map(asset => (
          <AssetCard
            key={asset._id}
            name={asset.name}
            subtitle={asset.platform}
            icon={asset.icon}
            status={asset.status}
            onClick={() => openEdit(asset)}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-h2" style={{ marginBottom: '1rem' }}>
              {editAsset ? 'Edit Asset' : 'Add Asset'}
            </h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="Asset name"
                placeholder="Google Photos"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Platform"
                placeholder="Google, Apple, Twitter..."
                value={form.platform}
                onChange={e => setForm({ ...form, platform: e.target.value })}
              />
              <div className="input-group">
                <label className="input-group__label">Type</label>
                <select
                  className="input-group__input"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="social">Social Media</option>
                  <option value="storage">Cloud Storage</option>
                  <option value="financial">Financial</option>
                  <option value="creative">Creative</option>
                  <option value="communication">Communication</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                <Button type="submit" full>{editAsset ? 'Save changes' : 'Add asset'}</Button>
                {editAsset && (
                  <Button variant="danger" type="button" onClick={() => { handleDelete(editAsset._id); setShowModal(false); }}>
                    Delete
                  </Button>
                )}
              </div>
            </form>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetsPage;
