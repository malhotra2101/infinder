import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';
import MetricsCards from './components/dashboard/MetricsCards';
import { useDashboardData } from './hooks/useDashboardData';

const Dashboard = () => {
  const { dashboardData, loading, error } = useDashboardData();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="dashboard-content">
      <AnalyticsDashboard />
      <MetricsCards metrics={dashboardData.metrics} />
    </div>
  );
};

export default Dashboard; 