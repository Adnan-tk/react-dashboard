import React, { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Line } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'

export default function WholesaleVsRetailTrendChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    api.get('/api/wholesale-vs-retail/', { params: debouncedFilters })
      .then(res => {
        setChartData({
          labels: res.data.labels,
          datasets: res.data.datasets.map((d, idx) => ({
            ...d,
            borderColor: idx === 0 ? '#3b82f6' : '#f59e0b', // blue vs orange
            fill: false,
            tension: 0.3
          }))
        })
      })
      .catch(err => console.error('Error loading wholesale vs retail trend', err))
  }, [debouncedFilters])

  const handleExportPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(img, 'PNG', 10, 10, 190, 0)
      pdf.save('WholesaleVsRetailTrend.pdf')
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
    const sheet = XLSX.utils.aoa_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Data')
    XLSX.writeFile(wb, 'WholesaleVsRetailTrend.xlsx')
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          🛒 Wholesale vs Retail Trend
        </h2>
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
