import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import './BeneficiaryPortalPage.css';

const STATUS_MAP = {
  completed: { label: 'Completed', variant: 'sage' },
  'in-progress': { label: 'In Progress', variant: 'gold' },
  pending: { label: 'Pending', variant: 'slate' },
  failed: { label: 'Failed', variant: 'rose' },
};

function BeneficiaryPortalPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/beneficiary/portal/${token}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setError('This link may have expired or is invalid.'));
  }, [token]);

  return (
    <div className="beneficiary-portal">
      <div className="beneficiary-portal__header">
        <div className="beneficiary-portal__logo">DataWill</div>
        <h1 className="beneficiary-portal__title">
          You've been named in a<br /><em>digital will.</em>
        </h1>
        <p className="beneficiary-portal__desc">
          The following digital assets have been designated to you. Below is the execution status of each item.
        </p>
      </div>

      <div className="beneficiary-portal__content container">
        {error && (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>🔗</div>
              <h2 className="text-h2">Link not available</h2>
              <p className="text-body">{error}</p>
            </div>
          </Card>
        )}

        {!data && !error && (
          <div className="beneficiary-portal__loading">
            <div className="skeleton" style={{ height: '60px', marginBottom: '12px' }}></div>
            <div className="skeleton" style={{ height: '60px', marginBottom: '12px' }}></div>
            <div className="skeleton" style={{ height: '60px' }}></div>
          </div>
        )}

        {data && (
          <div className="beneficiary-portal__list">
            {(data.executions || []).map((exec, i) => {
              const status = STATUS_MAP[exec.status] || STATUS_MAP.pending;
              return (
                <Card key={i} className="beneficiary-item">
                  <div className="beneficiary-item__top">
                    <div>
                      <div className="beneficiary-item__asset">{exec.assetName || 'Digital Asset'}</div>
                      <div className="beneficiary-item__action">{exec.action || 'Transfer'}</div>
                    </div>
                    <Badge variant={status.variant} dot>{status.label}</Badge>
                  </div>
                  {exec.executedAt && (
                    <div className="text-caption" style={{ marginTop: '6px' }}>
                      Executed: {new Date(exec.executedAt).toLocaleString()}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="beneficiary-portal__footer">
        <p className="text-caption">DataWill — Your digital life, on your terms.</p>
      </div>
    </div>
  );
}

export default BeneficiaryPortalPage;
