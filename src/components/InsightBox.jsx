
// import React, { useEffect, useState, useContext } from 'react'
// import axios from '../api/axios'
// import { FilterContext } from '../context/FilterContext'

// export default function InsightBox({ chart }) {
//   const { filters } = useContext(FilterContext)
//   const [insight, setInsight] = useState('Loading...')

//   // useEffect(() => {
//   //   const params = { ...filters, chart }
//   //   axios.get('/api/insights/', { params }).then(res => setInsight(res.data.insight))
//   // }, [filters, chart])
//   useEffect(() => {
//     if (!chart) return

//     // ✅ Filter out empty values
//     const cleanedParams = { chart }
//     Object.entries(filters).forEach(([key, val]) => {
//       if (val && val.trim() !== '') {
//         cleanedParams[key] = val
//       }
//     })

//     axios
//       .get('insights/', { params: cleanedParams })
//       .then(res => setInsight(res.data.insight))
//       .catch(err => {
//         console.error(err)
//         setInsight('Insight unavailable.')
//       })
//   }, [filters, chart])

//   return (
//     <div className="text-sm italic text-gray-600 dark:text-gray-300 mt-2">
//       🔍 Insight: {insight}
//     </div>
//   )
// }


// import React, { useEffect, useState, useContext } from 'react'
// import axios from '../api/axios'
// import { FilterContext } from '../context/FilterContext'

// export default function InsightBox({ chart }) {
//   const { filters } = useContext(FilterContext)
//   const [insight, setInsight] = useState('Loading...')

//   useEffect(() => {
//     const controller = new AbortController()
//     setInsight('Loading...')

//     const filteredParams = {}
//     Object.entries(filters).forEach(([k, v]) => {
//       if (v) filteredParams[k] = v
//     })
//     filteredParams.chart = chart

//     axios.get('insights/', {
//       params: filteredParams,
//       signal: controller.signal
//     })
//       .then(res => {
//         setInsight(res.data?.insight || 'Insight unavailable.')
//       })
//       .catch(() => setInsight('Insight unavailable.'))

//     return () => controller.abort()
//   }, [filters, chart])

//   return (
//     <div className="text-sm italic text-gray-600 dark:text-gray-300 mt-2">
//       🔍 Insight: {insight}
//     </div>
//   )
// }


import React, { useEffect, useState, useContext } from 'react'
import api from '../api/axios'
import { FilterContext } from '../context/FilterContext'

export default function InsightBox({ chart }) {
  const { debouncedFilters } = useContext(FilterContext)
  const [insight, setInsight] = useState('Loading...')

  useEffect(() => {
    const controller = new AbortController()
    setInsight('Loading...')

    const filteredParams = {}
    Object.entries(debouncedFilters).forEach(([k, v]) => {
      if (v) filteredParams[k] = v
    })
    filteredParams.chart = chart

    api.get('/api/insights/', {
      params: filteredParams,
      signal: controller.signal
    })
      .then(res => {
        setInsight(res.data?.insight || 'Insight unavailable.')
      })
      .catch((err) => {
        if (err.code === 'ERR_CANCELED') return
        setInsight('Insight unavailable.')
      })

    return () => controller.abort()
  }, [debouncedFilters, chart])

  return (
    <div className="text-sm italic text-gray-600 dark:text-gray-300 mt-2">
      🔍 Insight: {insight}
    </div>
  )
}
