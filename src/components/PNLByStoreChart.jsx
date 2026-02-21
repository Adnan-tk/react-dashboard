import React, { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Bar } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'

const metricOptions = ['Profit', 'Revenue', 'Cost']

export default function PNLByStoreChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [metric, setMetric] = useState('Profit')
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    api.get('/api/pnl-by-store/', {
      params: { ...debouncedFilters, metric }
    })
      .then(res => {
        setChartData({
          labels: res.data.labels,
          datasets: [
            {
              label: metric,
              data: res.data.data,
              backgroundColor: '#0ea5e9',
              barThickness: 24
            }
          ]
        })
      })
      .catch(err => {
        console.error('Error loading P&L by store', err)
      })
  }, [debouncedFilters, metric])

  const handleExportPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0)
      pdf.save(`PNLByStore-${metric}.pdf`)
    })
  }

  const handleExportExcel = () => {
    if (!chartData) return
    const rows = [['Store', metric]]
    chartData.labels.forEach((label, i) => {
      rows.push([label, chartData.datasets[0].data[i]])
    })
    const worksheet = XLSX.utils.aoa_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
    XLSX.writeFile(workbook, `PNLByStore-${metric}.xlsx`)
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          🏪 P&L by Store ({metric})
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
