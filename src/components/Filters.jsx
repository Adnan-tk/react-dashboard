import React, { useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { FilterContext } from '../context/FilterContext'
import { savePreset, loadPreset, presets } from '../utils/presets'

export default function Filters() {
  const { filters, updateFilter, resetFilters } = useContext(FilterContext)
  const [apiFilters, setApiFilters] = useState({})

  useEffect(() => {
    api.get("/api/filters/")
      .then(res => {
        setApiFilters(res.data);
      })
      .catch(err => console.error("Filters error:", err));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow rounded flex flex-wrap gap-4 items-center">
      <select className="border p-2 rounded" value={filters.region || ''} onChange={e => updateFilter('region', e.target.value)}>
        <option value="">Region</option>
        {apiFilters.regions?.map(r => <option key={r}>{r}</option>)}
      </select>
      <select className="border p-2 rounded" value={filters.store || ''} onChange={e => updateFilter('store', e.target.value)}>
        <option value="">Store</option>
        {apiFilters.stores?.map(r => <option key={r}>{r}</option>)}
      </select>
      <select className="border p-2 rounded" value={filters.salesperson || ''} onChange={e => updateFilter('salesperson', e.target.value)}>
        <option value="">Salesperson</option>
        {apiFilters.salespersons?.map(r => <option key={r}>{r}</option>)}
      </select>
      <select className="border p-2 rounded" value={filters.channel || ''} onChange={e => updateFilter('channel', e.target.value)}>
        <option value="">Channel</option>
        {apiFilters.channels?.map(r => <option key={r}>{r}</option>)}
      </select>
      <select className="border p-2 rounded" value={filters.customer || ''} onChange={e => updateFilter('customer', e.target.value)}>
        <option value="">Customer</option>
        {apiFilters.customers?.map(r => <option key={r}>{r}</option>)}
      </select>
      <select className="border p-2 rounded" value={filters.product || ''} onChange={e => updateFilter('product', e.target.value)}>
        <option value="">Product</option>
        {apiFilters.products?.map(r => <option key={r}>{r}</option>)}
      </select>
      <select className="border p-2 rounded" value={filters.transactiontype || ''} onChange={e => updateFilter('transactiontype', e.target.value)}>
        <option value="">Transaction Type</option>
        {apiFilters.transaction_types?.map(r => <option key={r}>{r}</option>)}
      </select>

      <input type="date" className="border p-2 rounded text-gray-800" value={filters.start_date || ''} onChange={e => updateFilter('start_date', e.target.value)} />
      <input type="date" className="border p-2 rounded text-gray-800" value={filters.end_date || ''} onChange={e => updateFilter('end_date', e.target.value)} />

      <button onClick={resetFilters} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold transition-colors">
        Reset All
      </button>

      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
        <button
          onClick={() => updateFilter('tax_type', 'exclusive')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${filters.tax_type === 'exclusive' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
        >
          Exclusive
        </button>
        <button
          onClick={() => updateFilter('tax_type', 'inclusive')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${filters.tax_type === 'inclusive' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
        >
          Inclusive
        </button>
      </div>

      <button onClick={toggleTheme} className="ml-auto bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
        Toggle Theme
      </button>

      <div className="flex gap-2 items-center border-l pl-4 border-gray-300 dark:border-gray-600">
        <input placeholder="Preset Name" id="presetName" className="border p-2 rounded text-sm w-32 dark:bg-gray-900 dark:text-white" />
        <button onClick={() => {
          const name = document.getElementById('presetName').value;
          if (name) savePreset(name);
        }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm transition-colors">Save</button>
      </div>

      <select onChange={e => loadPreset(e.target.value)} className="border p-2 rounded text-sm dark:bg-gray-900 dark:text-white">
        <option value="">Load Preset</option>
        {Object.keys(presets).map(name => <option key={name}>{name}</option>)}
      </select>
    </div>
  )
}
