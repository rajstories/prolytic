import React, { useEffect, useMemo, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { MetricCardProps } from '../types';
import { TrendingUp } from './ui/Icons';
import { useDashboardData } from './dashboard/DashboardDataContext';

const viewsData = [
  { name: 'Mon', views: 4000, retention: 2400 },
  { name: 'Tue', views: 3000, retention: 1398 },
  { name: 'Wed', views: 2000, retention: 9800 },
  { name: 'Thu', views: 2780, retention: 3908 },
  { name: 'Fri', views: 1890, retention: 4800 },
  { name: 'Sat', views: 2390, retention: 3800 },
  { name: 'Sun', views: 3490, retention: 4300 },
];

const demographicData = [
  { name: '18-24', value: 35 },
  { name: '25-34', value: 45 },
  { name: '35-44', value: 15 },
  { name: '45+', value: 5 },
];

const lowRetentionData = [
  { name: 'Mon', views: 4200, retention: 2200 },
  { name: 'Tue', views: 3800, retention: 1600 },
  { name: 'Wed', views: 3200, retention: 1200 },
  { name: 'Thu', views: 3100, retention: 1100 },
  { name: 'Fri', views: 3000, retention: 900 },
  { name: 'Sat', views: 2900, retention: 850 },
  { name: 'Sun', views: 2800, retention: 800 },
];

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend }) => (
  <div className="bg-white p-6 rounded-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-semibold text-slate-900">{value}</h3>
      </div>
      <span
        className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
          trend === 'up'
            ? 'bg-green-50 text-green-700'
            : trend === 'down'
            ? 'bg-red-50 text-red-700'
            : 'bg-slate-50 text-slate-700'
        }`}
      >
        {change}
      </span>
    </div>
  </div>
);

const MetricSkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-sm border border-slate-200 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-full">
        <div className="h-3 w-24 bg-slate-200 rounded"></div>
        <div className="h-7 w-32 bg-slate-200 rounded"></div>
      </div>
      <div className="h-5 w-14 bg-slate-200 rounded-full"></div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { data: dashboardData, loading, error } = useDashboardData();
  const followersCount = dashboardData?.user.followers_count;
  const reachCount = dashboardData?.insights.reach;
  const impressionsCount = dashboardData?.insights.impressions;
  const [demoFocus, setDemoFocus] = useState<'tech-retention' | 'cooking-ctr' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('prolytic:onboarding');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { niche?: string; struggle?: string };
      if (parsed.niche === 'tech' && parsed.struggle === 'retention') {
        setDemoFocus('tech-retention');
      } else if (parsed.niche === 'cooking' && parsed.struggle === 'ctr') {
        setDemoFocus('cooking-ctr');
      }
    } catch {
      setDemoFocus(null);
    }
  }, []);

  const chartData = useMemo(() => {
    if (demoFocus === 'tech-retention') return lowRetentionData;
    return viewsData;
  }, [demoFocus]);

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '—';
    return value.toLocaleString();
  };

  const handleExport = () => {
    const now = new Date();
    const reportDate = now.toLocaleDateString();
    const followers = formatNumber(followersCount);
    const reach = formatNumber(reachCount);
    const impressions = formatNumber(impressionsCount);

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Prolytic Report</title>
    <style>
      body { font-family: Inter, ui-sans-serif, system-ui; margin: 40px; color: #0f172a; }
      h1 { font-size: 28px; margin-bottom: 8px; }
      h2 { font-size: 18px; margin-top: 28px; }
      .meta { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; }
      .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 16px; }
      .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
      .label { color: #64748b; font-size: 12px; }
      .value { font-size: 22px; font-weight: 600; margin-top: 6px; }
      .section { margin-top: 24px; }
      .note { color: #475569; font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="meta">Prolytic • Audience Summary</div>
    <h1>Profile Performance Report</h1>
    <div class="note">Generated on ${reportDate}</div>

    <div class="section">
      <h2>Core Metrics</h2>
      <div class="grid">
        <div class="card"><div class="label">Followers</div><div class="value">${followers}</div></div>
        <div class="card"><div class="label">Reach (24h)</div><div class="value">${reach}</div></div>
        <div class="card"><div class="label">Impressions (24h)</div><div class="value">${impressions}</div></div>
      </div>
    </div>

    <div class="section">
      <h2>Summary</h2>
      <p class="note">
        This report consolidates live audience metrics and Prolytic analysis signals to provide
        a clear view of performance and momentum.
      </p>
    </div>
  </body>
</html>`;

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;
    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Platform performance summary for the last 7 days.</p>
        </div>
        <button
          onClick={handleExport}
          className="text-sm font-medium text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-sm hover:bg-slate-50 transition-colors"
        >
          Export Report
        </button>
      </header>

      {error && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-100 px-4 py-3 rounded-sm">
          Live data unavailable. Showing demo metrics. ({error})
        </div>
      )}

      {demoFocus && (
        <div className="border border-blue-100 bg-blue-50 text-blue-900 text-sm px-4 py-3 rounded-sm">
          {demoFocus === 'tech-retention' && (
            <span>Demo Mode: Tech Review Draft loaded — retention is underperforming.</span>
          )}
          {demoFocus === 'cooking-ctr' && (
            <span>Demo Mode: Cooking workflow — Thumbnail Analysis prioritized for CTR gains.</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Followers"
              value={formatNumber(followersCount)}
              change="—"
              trend="neutral"
            />
            <MetricCard
              title="Reach (24h)"
              value={formatNumber(reachCount)}
              change="—"
              trend="neutral"
            />
            <MetricCard
              title="Impressions (24h)"
              value={formatNumber(impressionsCount)}
              change="—"
              trend="neutral"
            />
            <MetricCard
              title="Est. Revenue"
              value="$4,289.00"
              change="+8.2%"
              trend="up"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        <div className="lg:col-span-2 min-w-0 bg-white p-6 rounded-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-slate-900">Audience Retention & Views</h3>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-500 mr-2"></div>Views</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-300 mr-2"></div>Retention</span>
            </div>
          </div>
          <div className="h-[300px] w-full min-w-0">
            {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="views" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="retention" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 bg-white p-6 rounded-sm border border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Demographics</h3>
          <div className="h-[300px] w-full min-w-0">
            {demographicData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={demographicData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={40}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                />
                <Bar dataKey="value" fill="#334155" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
