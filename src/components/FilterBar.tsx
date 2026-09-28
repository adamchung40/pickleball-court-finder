import type { Filters, Setting } from '../types'

type Props = {
  filters: Filters
  onChange: (next: Filters) => void
  onLocate: () => void
  locating: boolean
  locationError: string | null
}

export function FilterBar({ filters, onChange, onLocate, locating, locationError }: Props) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value })

  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder="Search by name or area…"
        value={filters.search}
        onChange={(e) => set('search', e.target.value)}
        aria-label="Search courts"
      />

      <div className="filter-row">
        <select
          value={filters.setting}
          onChange={(e) => set('setting', e.target.value as Setting)}
          aria-label="Indoor or outdoor"
        >
          <option value="any">Indoor + outdoor</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>

        <label className="check">
          <input type="checkbox" checked={filters.lightsOnly} onChange={(e) => set('lightsOnly', e.target.checked)} />
          Lights
        </label>

        <label className="check">
          <input type="checkbox" checked={filters.freeOnly} onChange={(e) => set('freeOnly', e.target.checked)} />
          Free
        </label>

        <button type="button" onClick={onLocate} disabled={locating}>
          {locating ? 'Locating…' : 'Near me'}
        </button>
      </div>

      {locationError && <p className="error">{locationError}</p>}
    </div>
  )
}
