import React, { useEffect, useState, useContext, useRef } from 'react'
import api from '../api/axios'
import { Bar } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { FilterContext } from '../context/FilterContext'

export default function TargetAchievementChart() {
  const { debouncedFilters } = useContext(FilterContext)
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    api.get('/api/target-achievement/', { params: debouncedFilters })
      .then(res => {
        setChartData({
          labels: res.data.labels,
          datasets: [{
            label: 'Achievement %',
            data: res.data.data,
            backgroundColor: res.data.data.map(v => 
              v >= 100 ? '#22c55e' : v >= 80 ? '#3b82f6' : '#ef4444'
            ) // Green if >=100%, Blue if >=80%, Red otherwise
          }]
        })
      })
      .catch(err => console.error('Error loading target achievement', err))
  }, [debouncedFilters])

  const handleExportPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(img, 'PNG', 10, 10, 190, 0)
      pdf.save('TargetAchievement.pdf')
    })
  }

  const handleExportExcel = () => {
    if (!chartData) return
    const rows = [['Salesperson', 'Achievement %']]
    chartData.labels.forEach((label, i) => {
      rows.push([label, chartData.datasets[0].data[i]])
    })
    const sheet = XLSX.utils.aoa_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Data')
    XLSX.writeFile(wb, 'TargetAchievement.xlsx')
  }

  if (!chartData) return null

  return (
    <div className="bg-white p-4 rounded shadow dark:bg-gray-800" ref={chartRef}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          🎯 Salesperson Target Achievement %
        </h2>
      </div>

      <Bar
        data={chartData}
        options={{
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              ticks: { color: '#666' },
              min: 0,
              max: 150 // show beyond 100%
            },
            y: { ticks: { color: '#666' } }
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
