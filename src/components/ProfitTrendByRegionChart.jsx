import React, { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Line } from 'react-chartjs-2'
import { FilterContext } from '../context/FilterContext'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

const metricOptions = ['Profit', 'Revenue', 'Cost']

export default function ProfitTrendByRegionChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [metric, setMetric] = useState('Profit')
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    api.get('/api/profit-trend-region/', {
      params: { ...debouncedFilters, metric }
    })
      .then(res => {
        setChartData({
          labels: res.data.labels,
          datasets: res.data.datasets.map((regionSet, idx) => ({
            ...regionSet,
            borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
            tension: 0.3,
            fill: false
          }))
        })
      })
      .catch(err => {
        console.error('Error loading profit trend data', err)
      })
  }, [debouncedFilters, metric])

  const handleExportPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0)
      pdf.save(`ProfitTrendByRegion-${metric}.pdf`)
    })
  }

  const handleExportExcel = () => {
    if (!chartData) return
    const rows = [['Month', ...chartData.datasets.map(d => d.label)]]
    chartData.labels.forEach((label, i) => {
      const row = [label]
      chartData.datasets.forEach(d => row.push(d.data[i]))
      rows.push(row)
    })
    const worksheet = XLSX.utils.aoa_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
    XLSX.writeFile(workbook, `ProfitTrendByRegion-${metric}.xlsx`)
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          💹 {metric} Trend by Region
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

      <Line data={chartData} />

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
