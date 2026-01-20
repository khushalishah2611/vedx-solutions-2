import { useCallback } from 'react';

import { useLoading } from '../contexts/LoadingContext.jsx';

export const useLoadingFetch = () => {
  const { withLoading } = useLoading();

  const fetchWithLoading = useCallback(
    (...args) => withLoading(() => fetch(...args)),
    [withLoading]
  );

  return { fetchWithLoading };
};
