import { useEffect, useState } from 'react';
import { AnalyticsApi } from '../api/client';
import type { AnalyticsSummary } from '../types';

export default function Analytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AnalyticsApi.summary()
      .then(setSummary)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="error">Failed to load analytics: {error}</p>;
  if (!summary) return <p>Loading analytics...</p>;

  return (
    <div>
      <h2>Analytics</h2>
      <div className="side-by-side">
        <div className="card">
          <h3>Total Orders</h3>
          <p className="big-number">{summary.totalOrders}</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p className="big-number">${Number(summary.totalRevenue).toFixed(2)}</p>
        </div>
      </div>

      <h3>Orders by Status</h3>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary.ordersByStatus).map(([status, count]) => (
            <tr key={status}>
              <td>{status}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
