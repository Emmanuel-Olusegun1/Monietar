import OverviewPage from '@/components/dashboard/overview/OverviewPage';
import { getDashboardData } from '@/lib/dashboard';

export default async function Page() {
  const dashboard = await getDashboardData();

  return (
    <OverviewPage
      darkMode={false}
      dashboard={dashboard}
      hasTransactionData={
        dashboard.transactions.length > 0
      }
    />
  );
}