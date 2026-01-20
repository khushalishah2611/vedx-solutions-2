import { useEffect, useState } from 'react';

import { apiUrl } from '../utils/const.js';

const normalizeType = (type) => (typeof type === 'string' ? type.trim().toLowerCase() : '');

const selectLatestBanner = (banners, type) => {
  const normalizedType = normalizeType(type);
  if (!normalizedType) return null;

  const matches = banners.filter((banner) => banner?.type === normalizedType);
  if (!matches.length) return null;

  return matches
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
};

export const useBannerByType = (type) => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadBanner = async () => {
      try {
        const response = await fetch(apiUrl('/api/banners'));
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        if (!isMounted) return;
        setBanner(selectLatestBanner(data ?? [], type));
      } catch (error) {
        console.error('Failed to load banners', error);
        if (isMounted) setBanner(null);
      }
    };

    loadBanner();

    return () => {
      isMounted = false;
    };
  }, [type]);

  return { banner };
};
