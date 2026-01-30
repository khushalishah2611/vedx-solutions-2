import { useEffect, useState } from 'react';

import { apiUrl } from '../utils/const.js';
import { useLoadingFetch } from './useLoadingFetch.js';

const normalizeType = (type) => (typeof type === 'string' ? type.trim().toLowerCase() : '');
const normalizeTypeKey = (type) => normalizeType(type).replace(/[^a-z0-9]/g, '');

const selectLatestBanner = (banners, type) => {
  const normalizedType = normalizeTypeKey(type);
  if (!normalizedType) return null;

  const matches = banners.filter((banner) => normalizeTypeKey(banner?.type) === normalizedType);
  if (!matches.length) return null;

  return matches
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
};

export const useBannerByType = (type) => {
  const [banner, setBanner] = useState(null);
  const { fetchWithLoading } = useLoadingFetch();

  useEffect(() => {
    let isMounted = true;

    const loadBanner = async () => {
      try {
        const response = await fetchWithLoading(apiUrl('/api/banners'));
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        if (!isMounted) return;
        const list = Array.isArray(data)
          ? data
          : (data?.banners || data?.data || data?.items || []);
        setBanner(selectLatestBanner(Array.isArray(list) ? list : [], type));
      } catch (error) {
        console.error('Failed to load banners', error);
        if (isMounted) setBanner(null);
      }
    };

    loadBanner();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading, type]);

  return { banner };
};
