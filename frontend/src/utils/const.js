const envBase = (import.meta.env?.VITE_API_BASE || "").trim();
const normalizedBase = envBase ? envBase.replace(/\/+$/, "") : "";
export const API_BASE = normalizedBase;
// Helper to build API URLs that works with or without a configured base
export const apiUrl = (path = "") => {
  const cleanPath = String(path || "");
  if (!API_BASE) return cleanPath;
  const prefixed = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${API_BASE}${prefixed}`;
};
