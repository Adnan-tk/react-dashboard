import React, { useEffect, useState, useContext, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'
import api from '../api/axios'

const metricOptions = ['Profit', 'Revenue']

export default function SalespersonLeaderboardChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [metric, setMetric] = useState('Profit')
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const params = { ...debouncedFilters, metric }
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k] })
    api.get('/api/salesperson-leaderboard/', { params })
      .then((res) => {
        const d = res.data
        const labels = d?.labels ?? []
        const data = d?.data ?? d?.datasets?.[0]?.data ?? []
        const m = d?.metric ?? metric
        setChartData({
          labels,
          datasets: [{
            label: `${m} (Top 10)`,
            data,
            backgroundColor: m === 'Profit' ? '#22c55e' : '#3b82f6',
          }],
        })
      })
      .catch(() => setChartData(null))
  }, [debouncedFilters, metric])


  const handleExportPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(img, 'PNG', 10, 10, 190, 0)
      pdf.save(`SalespersonLeaderboard-${metric}.pdf`)
    })
  }

  const handleExportExcel = () => {
    if (!chartData) return
    const rows = [['Salesperson', metric]]
    chartData.labels.forEach((label, i) => {
      rows.push([label, chartData.datasets[0].data[i]])
    })
    const sheet = XLSX.utils.aoa_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Data')
    XLSX.writeFile(wb, `SalespersonLeaderboard-${metric}.xlsx`)
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          📈 Salesperson Leaderboard ({metric})
        </h2>
        <select
          className="bg-gray-100 text-sm px-2 py-1 rounded"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          {metricOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <Bar
        data={chartData}
        options={{
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { ticks: { color: '#666' } },
            y: { ticks: { color: '#666' } }
          }
        }}
      />

      <div className="mt-4 flex gap-2">
        <button onClick={handleExportPDF} className="bg-blue-600 text-white px-3 py-1 rounded">
          📄 Export PDF
        </button>
        <button onClick={handleExportExcel} className="bg-green-600 text-white px-3 py-1 rounded">
          📊 Export Excel
        </button>
      </div>
    </div>
  )
}