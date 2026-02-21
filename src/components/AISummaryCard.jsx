
// import React, { useEffect, useState, useContext } from 'react'
// import axios from 'axios'
// import { FilterContext } from '../context/FilterContext'

// export default function AISummaryCard() {
//   const { filters } = useContext(FilterContext)
//   const [summary, setSummary] = useState(null)

//   useEffect(() => {
//     axios.get('/api/summary/', { params: filters }).then(res => setSummary(res.data))
//   }, [filters])

//   if (!summary) return null

//   return (
//     <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded mb-4 shadow text-gray-800 dark:text-white">
//       <h2 className="text-xl font-bold mb-2">📊 AI Summary</h2>
//       <p>Total Revenue: ₹{summary.total_revenue}</p>
//       <p>Total Profit: ₹{summary.total_profit}</p>
//       <p>Top Product: {summary.top_product}</p>
//       <p>Top Salesperson: {summary.top_salesperson}</p>
//     </div>
//   )
// }


// import React, { useEffect, useState, useContext } from 'react'
// import axios from '../api/axios'
// import { FilterContext } from '../context/FilterContext'

// export default function AISummaryCard() {
//   const { filters } = useContext(FilterContext)
//   const [summary, setSummary] = useState(null)

//   useEffect(() => {
//     const cleanedParams = {}
//     Object.entries(filters).forEach(([key, val]) => {
//       if (val && val.trim() !== '') {
//         cleanedParams[key] = val
//       }
//     })

//     axios
//       .get('summary/', { params: cleanedParams })
//       .then(res => setSummary(res.data))
//       .catch(err => {
//         console.error('Summary fetch failed:', err)
//         setSummary({ error: 'Summary unavailable.' })
//       })
//   }, [filters])

//   if (!summary || summary.error) {
//     return (
//       <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-4 shadow text-gray-800 dark:text-white">
//         <h2 className="text-xl font-bold mb-2">📊 AI Summary</h2>
//         <p>{summary?.error || 'Loading summary...'}</p>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded mb-4 shadow text-gray-800 dark:text-white">
//       <h2 className="text-xl font-bold mb-2">📊 AI Summary</h2>
//       <p>Total Revenue: ₹{summary.total_revenue}</p>
//       <p>Total Profit: ₹{summary.total_profit}</p>
//       <p>Top Product: {summary.top_product}</p>
//       <p>Top Salesperson: {summary.top_salesperson}</p>
//     </div>
//   )
// }


import React, { useEffect, useState, useContext } from 'react'
import api from '../api/axios'
import { FilterContext } from '../context/FilterContext'

export default function AISummaryCard() {
  const { debouncedFilters } = useContext(FilterContext)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const filteredParams = {}
    Object.entries(debouncedFilters).forEach(([k, v]) => {
      if (v) filteredParams[k] = v
    })

    api.get('/api/summary/', { params: filteredParams, signal: controller.signal })
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [debouncedFilters])

  return (
    <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded mb-4 shadow text-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-2">📊 AI Summary</h2>
      {loading ? (
        <p>Loading summary...</p>
      ) : summary && (summary.total_revenue != null || summary.top_product) ? (
        <>
          <p>Total Revenue: ₹{summary.total_revenue ?? '0'}</p>
          <p>Total Profit: ₹{summary.total_profit ?? '0'}</p>
          <p>Top Product: {summary.top_product ?? 'N/A'}</p>
          <p>Top Salesperson: {summary.top_salesperson ?? 'N/A'}</p>
        </>
      ) : (
        <p className="text-red-600">Summary unavailable.</p>
      )}
    </div>
  )
}
