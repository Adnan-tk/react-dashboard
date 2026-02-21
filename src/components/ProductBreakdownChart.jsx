
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

export default function ProductBreakdownChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [data, setData] = useState({ labels: [], datasets: [] })
  const chartRef = useRef(null)

  const fetchData = () => {
    const params = { ...debouncedFilters, group_by: 'Product' }
    api.get('/api/breakdown/', { params })
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : []
        const labels = arr.map((r) => r['Product'] ?? '')
        const values = arr.map((r) => r['Revenue'] ?? 0)
        setData({
          labels,
          datasets: [{ label: 'Revenue', data: values, backgroundColor: 'teal' }],
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
      pdf.save('productbreakdownchart.pdf')
    })
  }

  const exportExcel = () => {
      const ws = XLSX.utils.json_to_sheet(data.labels.map((label, i) => ({
        'Product': label,
        'Revenue': data.datasets[0]?.data[i]
      })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'ProductBreakdownChart')
    XLSX.writeFile(wb, 'productbreakdownchart.xlsx')
  }

  return (
    <div ref={chartRef} className="bg-white dark:bg-gray-800 p-4 shadow rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">📊 ProductBreakdownChart</h2>
        <div className="flex items-center gap-2">
          <button onClick={exportPDF} className="bg-blue-600 text-white px-2 py-1 rounded">PDF</button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-2 py-1 rounded">Excel</button>
          <InsightBox chart="productbreakdown" />
        </div>
      </div>
      <Bar data={data} />
    </div>
  )
}
