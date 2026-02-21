import { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Line } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'

export default function PurchaseTrendChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const params = {}
    Object.entries(debouncedFilters).forEach(([k, v]) => { if (v) params[k] = v })
    api.get('/api/purchase-trend/', { params })
      .then((res) => {
        const d = res.data
        const labels = d?.labels ?? []
        const data = d?.datasets?.[0]?.data ?? d?.data ?? []
        setChartData({
          labels,
          datasets: [
            {
              label: d?.datasets?.[0]?.label ?? 'Purchase Amount',
              data,
              borderColor: '#9333ea',
              fill: false,
              tension: 0.3
            }
          ]
        })
      })
      .catch(() => setChartData(null))
  }, [debouncedFilters])

  const handleExportPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0)
      pdf.save('PurchaseTrendChart.pdf')
    })
  }

  const handleExportExcel = () => {
    if (!chartData) return
    const rows = [['Month', 'Purchase Cost']]
    chartData.labels.forEach((label, i) => {
      rows.push([label, chartData.datasets[0].data[i]])
    })
    const worksheet = XLSX.utils.aoa_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
    XLSX.writeFile(workbook, "PurchaseTrendChart.xlsx")
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          📦 Purchase Trend
        </h2>
      </div>

      <Line data={chartData} />

      <div className="mt-4 flex gap-2">
        <button onClick={handleExportPDF} className="bg-purple-600 text-white px-3 py-1 rounded">
          📄 Export PDF
        </button>
        <button onClick={handleExportExcel} className="bg-green-600 text-white px-3 py-1 rounded">
          📊 Export Excel
        </button>
      </div>
    </div>
  )
}
