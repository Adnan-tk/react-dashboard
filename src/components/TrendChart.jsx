import React, { useContext, useEffect, useRef, useState } from 'react'
import InsightBox from './InsightBox'
import api from '../api/axios'
import { Line } from 'react-chartjs-2'
import { FilterContext } from '../context/FilterContext'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function TrendChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [data, setData] = useState({ labels: [], datasets: [] })
  const chartRef = useRef(null)

  const fetchData = () => {
    const params = {}
    Object.entries(debouncedFilters).forEach(([k, v]) => { if (v) params[k] = v })
    api.get('/api/trend/', { params })
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : []
        const labels = rows.map((r) => r.Month)
        const revenue = rows.map((r) => r.Revenue ?? 0)
        const profit = rows.map((r) => r.Profit ?? 0)
        setData({
          labels,
          datasets: [
            { label: 'Revenue', data: revenue, borderColor: 'blue', tension: 0.5 },
            { label: 'Profit', data: profit, borderColor: 'green', tension: 0.5 },
          ],
        })
      })
      .catch(() => setData({ labels: [], datasets: [] }))
  }

  useEffect(() => {
    fetchData()
  }, [debouncedFilters])

  const exportPDF = () => {
    html2canvas(chartRef.current).then((canvas) => {
      const pdf = new jsPDF()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 90)
      pdf.save('trend_chart.pdf')
    })
  }

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.labels.map((label, i) => ({
        Month: label,
        Revenue: data.datasets[0]?.data[i],
        Profit: data.datasets[1]?.data[i],
      }))
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'TrendData')
    XLSX.writeFile(wb, 'trend_chart.xlsx')
  }

  return (
    <div ref={chartRef} className="bg-white dark:bg-gray-800 p-4 shadow rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">📈 Monthly Trend</h2>
        <div className="flex items-center gap-2">
          <button onClick={exportPDF} className="bg-blue-600 text-white px-2 py-1 rounded">PDF</button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-2 py-1 rounded">Excel</button>
          <InsightBox chart="trend" />
        </div>
      </div>
      <Line data={data} />
    </div>
  )
}
