const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('datawill_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const assetService = {
  async getAll() {
    const res = await fetch(`${API_URL}/assets`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch assets');
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create asset');
    return result;
  },

  async update(id, data) {
    const res = await fetch(`${API_URL}/assets/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update asset');
    return result;
  },

  async remove(id) {
    const res = await fetch(`${API_URL}/assets/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete asset');
    return res.json();
  }
};
