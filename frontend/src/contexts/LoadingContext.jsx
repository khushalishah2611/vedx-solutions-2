import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const LoadingContext = createContext({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
  withLoading: async (work) => work(),
});

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const withLoading = useCallback(
    async (work) => {
      startLoading();
      try {
        return await work();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  const value = useMemo(
    () => ({
      isLoading: loadingCount > 0,
      startLoading,
      stopLoading,
      withLoading,
    }),
    [loadingCount, startLoading, stopLoading, withLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => useContext(LoadingContext);
