import React, { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Bar } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'

const metricOptions = ['Profit', 'Revenue', 'Cost']
const metricColor = (m) =>
  m === 'Revenue' ? '#3b82f6' : m === 'Cost' ? '#ef4444' : '#22c55e' // blue, red, green

export default function ProfitByRegionChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [metric, setMetric] = useState('Profit')
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    api.get('/api/profit-by-region/', { params: { ...debouncedFilters, metric } })
      .then(res => {
        const activeMetric = res.data.metric || metric
        setChartData({
          labels: res.data.labels,
          datasets: [{
            label: activeMetric,
            data: res.data.data,
            backgroundColor: metricColor(activeMetric),
            barThickness: 24
          }]
        })
      })
      .catch(err => console.error('Error loading profit by region', err))
  }, [debouncedFilters, metric])

  const handleExportPDF = () => {
    if (!chartRef.current) return
    html2canvas(chartRef.current).then(canvas => {
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(img, 'PNG', 10, 10, 190, 0)
      pdf.save(`ProfitByRegion-${metric}.pdf`)
    })
  }

  const handleExportExcel = () => {
    if (!chartData) return
    const rows = [['Region', metric]]
    chartData.labels.forEach((label, i) => rows.push([label, chartData.datasets[0].data[i]]))
    const sheet = XLSX.utils.aoa_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Data')
    XLSX.writeFile(wb, `ProfitByRegion-${metric}.xlsx`)
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          📍 {metric} by Region
        </h2>
        <select
          className="bg-gray-100 text-sm px-2 py-1 rounded"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          {metricOptions.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { position: 'top', labels: { color: '#333' } } },
          scales: {
            x: { ticks: { color: '#666' } },
            y: { beginAtZero: true, ticks: { color: '#666' } }
          }
        }}
      />

      <div className="mt-4 flex gap-2">
        <button onClick={handleExportPDF} className="bg-blue-600 text-white px-3 py-1 rounded">📄 Export PDF</button>
        <button onClick={handleExportExcel} className="bg-green-600 text-white px-3 py-1 rounded">📊 Export Excel</button>
      </div>
    </div>
  )
}
