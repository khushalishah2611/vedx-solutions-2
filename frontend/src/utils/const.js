const normalizedBase = ("http://localhost:5000/" ?? '').trim().replace(/\/$/, '');
// const normalizedBase = ("http://72.60.96.241:5000/" ?? '').trim().replace(/\/$/, '');

export const API_BASE = normalizedBase;
// Helper to build API URLs that works with or without a configured base
export const apiUrl = (path = '') => `${API_BASE}${path}`;
