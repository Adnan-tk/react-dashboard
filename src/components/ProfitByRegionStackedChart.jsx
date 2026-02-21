import React, { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Bar } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'

export default function ProfitByRegionStackedChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    api.get('/api/region-pnl-stacked/', {
      params: debouncedFilters,
      signal: controller.signal
    })
      .then(res => {
        const { labels, datasets } = res.data
        setChartData({
          labels,
          datasets: datasets.map((d) => ({
            ...d,
            // colors: Revenue=blue, Cost=red, Profit=green
            backgroundColor:
              d.label === 'Revenue' ? '#3b82f6' :
              d.label === 'Cost'    ? '#ef4444' :
                                      '#22c55e',
            stack: 'pnl',  // all on same stack
            borderWidth: 1
          }))
        })
      })
      .catch(err => {
        if (err?.code !== 'ERR_CANCELED') {
          console.error('Error loading region stacked P&L', err)
        }
      })

    return () => controller.abort()
  }, [debouncedFilters])

  const handleExportPDF = () => {
    if (!chartRef.current) return
    html2canvas(chartRef.current).then(canvas => {
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(img, 'PNG', 10, 10, 190, 0)
      pdf.save('ProfitByRegion-Stacked.pdf')
    })
  }

  const handleExportExcel = () => {
    if (!chartData) return
    const rows = [['Region', ...chartData.datasets.map(d => d.label)]]
    chartData.labels.forEach((label, i) => {
      const row = [label]
      chartData.datasets.forEach(d => row.push(d.data[i]))
      rows.push(row)
    })
    const sheet = XLSX.utils.aoa_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Data')
    XLSX.writeFile(wb, 'ProfitByRegion-Stacked.xlsx')
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          📍 Region P&amp;L — Stacked (Revenue / Cost / Profit)
        </h2>
      </div>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top', labels: { color: '#333' } }
          },
          scales: {
            x: { stacked: true, ticks: { color: '#666' } },
            y: { stacked: true, beginAtZero: true, ticks: { color: '#666' } }
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
