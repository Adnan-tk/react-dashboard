import React, { useEffect, useState, useContext } from 'react'
import api from '../api/axios'
import { FilterContext } from '../context/FilterContext'

export default function KPISection() {
  const [data, setData] = useState({})
  const { debouncedFilters } = useContext(FilterContext)

  useEffect(() => {
    const params = {}
    Object.entries(debouncedFilters).forEach(([k, v]) => { if (v) params[k] = v })

    api.get('/api/kpis/', { params })
      .then((res) => setData(res.data ?? {}))
      .catch((err) => {
        console.error('Error loading KPI data', err)
        setData({})
      })
  }, [debouncedFilters])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 shadow rounded dark:bg-gray-800">
        <span className="text-gray-600 dark:text-gray-400">💰 Revenue:</span>
        <span className="font-bold ml-2 text-gray-800 dark:text-white">{data.total_revenue ?? '--'}</span>
      </div>
      <div className="bg-white p-4 shadow rounded dark:bg-gray-800">
        <span className="text-gray-600 dark:text-gray-400">📦 Quantity:</span>
        <span className="font-bold ml-2 text-gray-800 dark:text-white">{data.total_quantity ?? '--'}</span>
      </div>
      <div className="bg-white p-4 shadow rounded dark:bg-gray-800">
        <span className="text-gray-600 dark:text-gray-400">🏆 Target %:</span>
        <span className="font-bold ml-2 text-gray-800 dark:text-white">{data.achievement_pct ?? '--'}%</span>
      </div>
      <div className="bg-white p-4 shadow rounded dark:bg-gray-800">
        <span className="text-gray-600 dark:text-gray-400">↩️ Returns:</span>
        <span className="font-bold ml-2 text-gray-800 dark:text-white">{data.total_returns ?? '--'}</span>
      </div>
    </div>
  )
}