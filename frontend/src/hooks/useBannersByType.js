import { useEffect, useMemo, useState } from 'react';

import { apiUrl } from '../utils/const.js';

const normalizeType = (type) => (typeof type === 'string' ? type.trim().toLowerCase() : '');

export const useBannersByType = (type) => {
  const [banners, setBanners] = useState([]);

  const normalizedType = useMemo(() => normalizeType(type), [type]);

  useEffect(() => {
    let isMounted = true;

    const loadBanners = async () => {
      try {
        const response = await fetch(apiUrl('/api/banners'));
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        if (!isMounted) return;
        const filtered = (data ?? []).filter((banner) => banner?.type === normalizedType);
        setBanners(
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      } catch (error) {
        console.error('Failed to load banners', error);
        if (isMounted) setBanners([]);
      }
    };

    if (normalizedType) {
      loadBanners();
    } else {
      setBanners([]);
    }

    return () => {
      isMounted = false;
    };
  }, [normalizedType]);

  return { banners };
};
