const normalizedBase = (import.meta.env.VITE_API_BASE ?? '').trim().replace(/\/$/, '');

export const API_BASE = normalizedBase;
// Helper to build API URLs that works with or without a configured base
export const apiUrl = (path = '') => `${API_BASE}${path}`;
