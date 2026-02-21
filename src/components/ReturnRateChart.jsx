import React, { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Bar } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'

export default function ReturnRateChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const params = {}
    Object.entries(debouncedFilters).forEach(([k, v]) => { if (v) params[k] = v })
    api.get('/api/return-rate/', { params })
      .then((res) => {
        setChartData({
          labels: res.data?.labels ?? [],
          datasets: (res.data?.datasets ?? []).map((dataset, idx) => ({
            ...dataset,
            backgroundColor: idx === 0 ? '#3b82f6' : '#ef4444',
            barThickness: 20
          }))
        })
      })
      .catch(() => setChartData(null))
  }, [debouncedFilters])

  const handleExportPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0)
      pdf.save('ReturnRateChart.pdf')
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
    XLSX.writeFile(workbook, "ReturnRateChart.xlsx")
  }

  if (!chartData) return null
  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          🔁 Return Rate: Sales vs Returns
        </h2>
      </div>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#333' }
            }
          },
          scales: {
            x: { ticks: { color: '#666' } },
            y: {
              beginAtZero: true,
              ticks: { color: '#666' }
            }
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
