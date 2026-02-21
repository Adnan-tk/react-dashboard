
import React from 'react'
import TrendChart from './TrendChart'
import KPISection from './KPISection'
import Filters from './Filters'
import BreakdownChart from './BreakdownChart'
import TopChart from './TopChart'
import PNLChart from './PNLChart'
import DistributionChart from './DistributionChart'
import RegionBreakdownChart from './RegionBreakdownChart'
import CustomerTopChart from './CustomerTopChart'
import ProductBreakdownChart from './ProductBreakdownChart'
import TransactionTypeChart from './TransactionTypeChart'
import SupplierChart from './SupplierChart'
import AISummaryCard from './AISummaryCard'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <Filters />
      <AISummaryCard />
      <KPISection />
      <TrendChart />
      <BreakdownChart />
      <TopChart />
      <PNLChart />
      <DistributionChart />
      <RegionBreakdownChart />
      <CustomerTopChart />
      <ProductBreakdownChart />
      <TransactionTypeChart />
      <SupplierChart />
    </div>
  )
}
