import React from 'react';
import KPISection from './KPISection';
import TrendChart from './TrendChart';
import BreakdownChart from './BreakdownChart';
import TopChart from './TopChart';
import PNLChart from './PNLChart';
import DistributionChart from './DistributionChart';
// import CustomerBreakdownChart from './CustomerBreakdownChart';
import CustomerTopChart from './CustomerTopChart';
import ProductBreakdownChart from './ProductBreakdownChart';
import TransactionTypeChart from './TransactionTypeChart';
import SupplierChart from './SupplierChart';
import Filters from './Filters'
import AISummaryCard from './AISummaryCard';

import ProfitTrendByRegionChart from './ProfitTrendByRegionChart';
import SalespersonTargetChart from './SalespersonTargetChart';
import PurchaseTrendChart from './PurchaseTrendChart';
import ReturnRateChart from './ReturnRateChart';
import PNLByStoreChart from './PNLByStoreChart';
import ProfitByRegionChart from './ProfitByRegionChart';
import ProfitByRegionStackedChart from './ProfitByRegionStackedChart';
import WholesaleVsRetailTrendChart from './WholesaleVsRetailTrendChart';
import PurchaseReturnRateChart from './PurchaseReturnRateChart';
import PNLByMonthChart from './PNLByMonthChart';
import SalespersonLeaderboardChart from './SalespersonLeaderboardChart';
import TargetAchievementChart from './TargetAchievementChart';
import CustomerInsightsChart from './CustomerInsightsChart';
import SupplierPerformanceChart from './SupplierPerformanceChart';
import ChannelMixChart from './ChannelMixChart';


export default function DashboardGrid() {
  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">Business Dashboard</h1>
      <KPISection />
        <Filters />
              <AISummaryCard />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        <ProfitTrendByRegionChart />

        <SalespersonTargetChart />
        
        <PurchaseTrendChart />

        <ReturnRateChart />

        <PNLByStoreChart />

        <ProfitByRegionChart />

        <ProfitByRegionStackedChart />

        <WholesaleVsRetailTrendChart />

        <PurchaseReturnRateChart />

        <PNLByMonthChart />

        <SalespersonLeaderboardChart />

        <TargetAchievementChart />

        <CustomerInsightsChart />

        <SupplierPerformanceChart />

        <ChannelMixChart />
        
        <TrendChart />
        <BreakdownChart />
        <TopChart />
        <PNLChart />
        <DistributionChart />
        {/* <CustomerBreakdownChart /> */}
        <CustomerTopChart />
        <ProductBreakdownChart />
        <TransactionTypeChart />
        <SupplierChart />
      </div>
    </div>
  );
}
