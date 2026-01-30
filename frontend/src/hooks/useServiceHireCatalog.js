import { useCallback, useEffect, useMemo, useState } from 'react';

import { apiUrl } from '../utils/const.js';
import { megaMenuContent } from '../data/content.js';
import { useLoadingFetch } from './useLoadingFetch.js';

const buildServiceMenu = (categories, subCategories) => {
  const grouped = new Map();

  subCategories.forEach((sub) => {
    if (!grouped.has(sub.categoryId)) {
      grouped.set(sub.categoryId, []);
    }
    grouped.get(sub.categoryId).push(sub);
  });

  const menuCategories = categories.map((category) => {
    const items = grouped.get(category.id) ?? category.subCategories ?? [];
    const sortedItems = [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const categoryHref = `/services/${category.slug}`;

    return {
      label: category.name,
      href: categoryHref,
      description: category.description || '',
      subItems: sortedItems.map((sub) => ({
        label: sub.name,
        href: `/services/${category.slug}/${sub.slug}`,
      })),
    };
  });

  return {
    heading: megaMenuContent.services.heading,
    categories: menuCategories,
  };
};

const buildHireMenu = (categories, roles) => {
  const grouped = new Map();

  roles.forEach((role) => {
    if (!grouped.has(role.hireCategoryId)) {
      grouped.set(role.hireCategoryId, []);
    }
    grouped.get(role.hireCategoryId).push(role);
  });

  const menuCategories = categories.map((category) => {
    const items = grouped.get(category.id) ?? category.roles ?? [];
    const sortedItems = [...items].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    const categoryHref = `/hire-developers/${category.slug}`;

    return {
      label: category.title,
      href: categoryHref,
      description: category.description || '',
      subItems: sortedItems.map((role) => ({
        label: role.title,
        href: `/hire-developers/${category.slug}/${role.slug}`,
      })),
    };
  });

  return {
    heading: megaMenuContent.hireDevelopers.heading,
    categories: menuCategories,
  };
};

export const useServiceHireCatalog = () => {
  const { fetchWithLoading } = useLoadingFetch();
  const [serviceCategories, setServiceCategories] = useState([]);
  const [serviceSubCategories, setServiceSubCategories] = useState([]);
  const [hireCategories, setHireCategories] = useState([]);
  const [hireRoles, setHireRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJson = useCallback(
    async (path, options) => {
      const response = await fetchWithLoading(apiUrl(path), options);
      if (!response.ok) {
        const error = new Error(`Request failed: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return response.json();
    },
    [fetchWithLoading]
  );

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      setIsLoading(true);
      const loadPublicCatalog = async () => {
        const [serviceCategoryPayload, serviceSubCategoryPayload] = await Promise.all([
          fetchJson('/api/service-categories'),
          fetchJson('/api/service-subcategories'),
        ]);

        const hireCategoryPayload = await fetchJson('/api/hire-categories');

        if (!isMounted) return;

        setServiceCategories(serviceCategoryPayload.categories ?? []);
        setServiceSubCategories(serviceSubCategoryPayload.subCategories ?? []);
        setHireCategories(hireCategoryPayload.categories ?? []);
        setHireRoles(
          hireCategoryPayload.categories?.flatMap((category) => category.roles ?? []) ?? []
        );
      };

      try {
        const token = localStorage.getItem('adminToken');

        if (token) {
          const authHeaders = { Authorization: `Bearer ${token}` };
          const [serviceCategoryPayload, serviceSubCategoryPayload] = await Promise.all([
            fetchJson('/api/admin/service-categories', { headers: authHeaders }),
            fetchJson('/api/admin/service-subcategories', { headers: authHeaders }),
          ]);

          const [hireCategoryPayload, hireRolePayload] = await Promise.all([
            fetchJson('/api/admin/hire-categories', { headers: authHeaders }),
            fetchJson('/api/admin/hire-roles', { headers: authHeaders }),
          ]);

          if (!isMounted) return;

          setServiceCategories(serviceCategoryPayload.categories ?? []);
          setServiceSubCategories(serviceSubCategoryPayload.subCategories ?? []);
          setHireCategories(hireCategoryPayload.categories ?? []);
          setHireRoles(
            hireRolePayload.roles ??
              hireCategoryPayload.categories?.flatMap((category) => category.roles ?? []) ??
              []
          );
          return;
        }

        await loadPublicCatalog();
      } catch (error) {
        if (!isMounted) return;
        if (error?.status !== 401) {
          console.error('Failed to load menu catalog', error);
        }

        try {
          await loadPublicCatalog();
        } catch (fallbackError) {
          console.error('Failed to load public menu catalog', fallbackError);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, [fetchJson]);

  const serviceMenu = useMemo(() => {
    if (!serviceCategories.length) return null;
    return buildServiceMenu(serviceCategories, serviceSubCategories);
  }, [serviceCategories, serviceSubCategories]);

  const hireMenu = useMemo(() => {
    if (!hireCategories.length) return null;
    return buildHireMenu(hireCategories, hireRoles);
  }, [hireCategories, hireRoles]);

  return {
    serviceCategories,
    serviceSubCategories,
    hireCategories,
    hireRoles,
    serviceMenu,
    hireMenu,
    isLoading,
  };
};
