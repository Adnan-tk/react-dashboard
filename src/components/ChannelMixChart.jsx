import React, { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Line } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'

export default function ChannelMixChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    api.get('/api/channel-mix/', { params: debouncedFilters, signal: controller.signal })
      .then(res => {
        setChartData({
          labels: res.data.labels,
          datasets: res.data.datasets.map((d, idx) => ({
            ...d,
            borderColor: `hsl(${(idx * 65) % 360}, 70%, 45%)`,
            backgroundColor: `hsla(${(idx * 65) % 360}, 70%, 45%, 0.25)`,
            fill: true,
            tension: 0.25
          }))
        })
      })
      .catch(err => {
        if (err?.code !== 'ERR_CANCELED') console.error('Channel mix error', err)
      })
    return () => controller.abort()
  }, [debouncedFilters])

  const handleExportPDF = () => {
    if (!chartRef.current) return
    html2canvas(chartRef.current).then(canvas => {
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(img, 'PNG', 10, 10, 190, 0)
      pdf.save('ChannelMixOverTime.pdf')
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
    XLSX.writeFile(wb, 'ChannelMixOverTime.xlsx')
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">🧮 Channel Mix Over Time</h2>
      </div>

      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { position: 'top' } },
          scales: {
            x: { stacked: true, ticks: { color: '#666' } },
            y: { stacked: true, beginAtZero: true, ticks: { color: '#666' } }
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
