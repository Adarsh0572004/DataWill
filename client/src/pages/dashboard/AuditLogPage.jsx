import { useState, useEffect } from 'react';
import { auditLogService } from '../../services/extraServices';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './AuditLogPage.css';

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (p) => {
    setLoading(true);
    try {
      const data = await auditLogService.getLogs(p);
      setLogs(data.logs);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(1); }, []);

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="audit-page animate-fade-in">
      <h1 className="text-h1">Audit Log</h1>
      <p className="text-caption" style={{ marginBottom: '1.25rem' }}>
        Every significant action on your account is logged here for transparency.
      </p>

      {!loading && logs.length === 0 && (
        <div className="audit-page__empty">
          <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📜</div>
          <h2 className="text-h2">No activity yet</h2>
          <p className="text-body">Your audit trail will appear here as you use DataWill.</p>
        </div>
      )}

      {logs.length > 0 && (
        <Card>
          <table className="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td className="audit-table__date">{formatDate(log.timestamp)}</td>
                  <td className="audit-table__action">{log.action}</td>
                  <td className="audit-table__details">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="audit-page__pagination">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => fetchLogs(page - 1)}>← Prev</Button>
          <span className="text-caption">Page {page} of {totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => fetchLogs(page + 1)}>Next →</Button>
        </div>
      )}
    </div>
  );
}

export default AuditLogPage;
