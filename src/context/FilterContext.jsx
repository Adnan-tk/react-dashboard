
import React, { createContext, useState, useEffect, useRef } from 'react'

export const FilterContext = createContext()

const DEBOUNCE_MS = 400

export function FilterProvider({ children }) {
  const defaultFilters = {
    start_date: '',
    end_date: '',
    region: '',
    store: '',
    salesperson: '',
    channel: '',
    customer: '',
    product: '',
    transactiontype: '',
    tax_type: 'exclusive'
  }

  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('activeFilters')
    return saved ? JSON.parse(saved) : defaultFilters
  })

  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedFilters(filters)
      debounceRef.current = null
    }, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [filters])

  const [presets, setPresets] = useState(() => {
    const saved = localStorage.getItem('filterPresets')
    return saved ? JSON.parse(saved) : {}
  })

  const savePreset = (name) => {
    const updated = { ...presets, [name]: filters }
    setPresets(updated)
    localStorage.setItem('filterPresets', JSON.stringify(updated))
  }

  const loadPreset = (name) => {
    const selected = presets[name]
    if (selected) {
      setFilters(selected)
      localStorage.setItem('activeFilters', JSON.stringify(selected))
    }
  }

  const updateFilter = (name, value) => {
    const updated = { ...filters, [name]: value }
    setFilters(updated)
    localStorage.setItem('activeFilters', JSON.stringify(updated))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    localStorage.removeItem('activeFilters')
  }

  return (
    <FilterContext.Provider value={{ filters, debouncedFilters, updateFilter, resetFilters, presets, savePreset, loadPreset }}>
      {children}
    </FilterContext.Provider>
  )
}
