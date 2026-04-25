const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('datawill_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const ruleService = {
  async getAll() {
    const res = await fetch(`${API_URL}/rules`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch rules');
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_URL}/rules`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create rule');
    return result;
  },

  async update(id, data) {
    const res = await fetch(`${API_URL}/rules/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update rule');
    return result;
  },

  async remove(id) {
    const res = await fetch(`${API_URL}/rules/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete rule');
    return res.json();
  }
};
