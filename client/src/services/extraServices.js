const API_URL = import.meta.env.VITE_API_URL;
const getHeaders = () => {
  const token = localStorage.getItem('datawill_token');
  return { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
};

export const checkInService = {
  async getStatus() {
    const res = await fetch(`${API_URL}/checkin`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch check-in status');
    return res.json();
  },
  async performCheckIn() {
    const res = await fetch(`${API_URL}/checkin`, { method: 'POST', headers: getHeaders() });
    if (!res.ok) throw new Error('Check-in failed');
    return res.json();
  },
  async updateFrequency(frequency) {
    const res = await fetch(`${API_URL}/checkin/frequency`, {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify({ frequency })
    });
    if (!res.ok) throw new Error('Failed to update frequency');
    return res.json();
  }
};

export const auditLogService = {
  async getLogs(page = 1) {
    const res = await fetch(`${API_URL}/audit-log?page=${page}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  }
};

export const messageService = {
  async getAll() {
    const res = await fetch(`${API_URL}/messages`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },
  async create(data) {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create message');
    return result;
  },
  async remove(id) {
    const res = await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to delete message');
    return res.json();
  }
};

export const willVersionService = {
  async getAll() {
    const res = await fetch(`${API_URL}/will-versions`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch versions');
    return res.json();
  },
  async createSnapshot(changeSummary) {
    const res = await fetch(`${API_URL}/will-versions/snapshot`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify({ changeSummary })
    });
    if (!res.ok) throw new Error('Failed to create snapshot');
    return res.json();
  }
};
