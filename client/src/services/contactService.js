const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('datawill_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const contactService = {
  async getAll() {
    const res = await fetch(`${API_URL}/contacts`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch contacts');
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create contact');
    return result;
  },

  async update(id, data) {
    const res = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update contact');
    return result;
  },

  async remove(id) {
    const res = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete contact');
    return res.json();
  }
};
