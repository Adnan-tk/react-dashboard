export const savePreset = (name) => {
  const filters = JSON.parse(localStorage.getItem('filters') || '{}')
  const presets = JSON.parse(localStorage.getItem('presets') || '{}')
  presets[name] = filters
  localStorage.setItem('presets', JSON.stringify(presets))
  alert('Preset saved.')
}

export const loadPreset = (name) => {
  const presets = JSON.parse(localStorage.getItem('presets') || '{}')
  const filters = presets[name]
  if (filters) {
    localStorage.setItem('filters', JSON.stringify(filters))
    window.location.reload()
  }
}

export const presets = JSON.parse(localStorage.getItem('presets') || '{}')
