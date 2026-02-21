
import React, { useContext, useEffect, useRef, useState } from 'react'
import InsightBox from './InsightBox'
import api from '../api/axios'
import { FilterContext } from '../context/FilterContext'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function PNLChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [data, setData] = useState({ labels: [], datasets: [] })
  const chartRef = useRef(null)

  const fetchData = () => {
    const params = {}
    Object.entries(debouncedFilters).forEach(([k, v]) => { if (v) params[k] = v })
    api.get('/api/pnl/', { params })
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : []
        const labels = arr.map((r) => r['Month'] ?? '')
        const revenues = arr.map((r) => r['Revenue'] ?? 0)
        const costs = arr.map((r) => r['Cost'] ?? 0)
        const profits = arr.map((r) => r['Profit'] ?? 0)

        setData({
          labels,
          datasets: [
            { label: 'Revenue', data: revenues, backgroundColor: '#36A2EB' },
            { label: 'Cost', data: costs, backgroundColor: '#FF6384' },
            { label: 'Profit', data: profits, backgroundColor: '#4BC0C0' },
          ],
        })
      })
      .catch(() => setData({ labels: [], datasets: [] }))
  }

  useEffect(() => {
    fetchData()
  }, [debouncedFilters])

  const exportPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const pdf = new jsPDF()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 90)
      pdf.save('pnl_monthly_trend.pdf')
    })
  }

  const exportExcel = () => {
    const ws_data = data.labels.map((label, i) => ({
      'Month': label,
      'Revenue': data.datasets[0]?.data[i],
      'Cost': data.datasets[1]?.data[i],
      'Profit': data.datasets[2]?.data[i]
    }))
    const ws = XLSX.utils.json_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly_PNL')
    XLSX.writeFile(wb, 'monthly_pnl_report.xlsx')
  }

  return (
    <div ref={chartRef} className="bg-white dark:bg-gray-800 p-4 shadow rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">📈 Monthly Profit & Loss (P&L) Trend</h2>
        <div className="flex items-center gap-2">
          <button onClick={exportPDF} className="bg-blue-600 text-white px-2 py-1 rounded">PDF</button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-2 py-1 rounded">Excel</button>
          <InsightBox chart="pnl" />
        </div>
      </div>
      <Bar data={data} />
    </div>
  )
}
