import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import { fetchDashboardData, DashboardData } from '../../services/dashboardClient';
import { DEMO_RESULT, retentionMockData } from '../../services/mockData';

type DashboardDataState = {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const DashboardDataContext = createContext<DashboardDataState | undefined>(
  undefined
);

export const DashboardDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const location = useLocation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackData: DashboardData = {
    source: 'demo',
    user: {
      id: 'demo',
      username: 'prolytic_demo',
      followers_count: 128540,
      media_count: 0
    },
    insights: {
      impressions: 184320,
      reach: 96420,
      profile_views: null,
      period: 'day'
    },
    retentionMockData,
    demoResult: DEMO_RESULT
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('ig') === 'connected') {
      refresh();
    }
  }, [location.search, refresh]);

  const value = useMemo(
    () => ({ data, loading, error, refresh }),
    [data, loading, error, refresh]
  );

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within DashboardDataProvider');
  }
  return context;
};
