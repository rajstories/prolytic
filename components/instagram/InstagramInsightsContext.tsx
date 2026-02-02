import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchInstagramInsights,
  InstagramInsights
} from '../../services/instagramClient';

type InstagramInsightsState = {
  insights: InstagramInsights | null;
  loading: boolean;
  error: string | null;
  refreshInsights: () => Promise<void>;
};

const InstagramInsightsContext = createContext<
  InstagramInsightsState | undefined
>(undefined);

export const InstagramInsightsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();
  const [insights, setInsights] = useState<InstagramInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchInstagramInsights();
      setInsights(response.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load insights.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('ig') === 'connected') {
      refreshInsights();
    }
  }, [location.search, refreshInsights]);

  const value = useMemo(
    () => ({ insights, loading, error, refreshInsights }),
    [insights, loading, error, refreshInsights]
  );

  return (
    <InstagramInsightsContext.Provider value={value}>
      {children}
    </InstagramInsightsContext.Provider>
  );
};

export const useInstagramInsights = () => {
  const context = useContext(InstagramInsightsContext);
  if (!context) {
    throw new Error(
      'useInstagramInsights must be used within InstagramInsightsProvider'
    );
  }
  return context;
};
