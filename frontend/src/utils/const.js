const normalizedBase = ("https://vedx-solutions-2-q1tn.vercel.app/" ?? '').trim().replace(/\/$/, '');

export const API_BASE = normalizedBase;
// Helper to build API URLs that works with or without a configured base
export const apiUrl = (path = '') => `${API_BASE}${path}`;
