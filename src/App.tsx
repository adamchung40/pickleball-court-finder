import { useMemo, useState } from 'react'
import { CourtList } from './components/CourtList'
import { CourtMap } from './components/CourtMap'
import { FilterBar } from './components/FilterBar'
import { SAMPLE_COURTS } from './data/courts'
import { useGeolocation } from './hooks/useGeolocation'
import { applyFilters, DEFAULT_FILTERS } from './lib/filters'
import type { Filters } from './types'

export default function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { location, status, error, locate } = useGeolocation()

  // Phase 2: replace SAMPLE_COURTS with data fetched from Supabase.
  const courts = useMemo(() => applyFilters(SAMPLE_COURTS, filters, location), [filters, location])

  return (
    <div className="app">
      <aside className="sidebar">
        <header>
          <h1>Court Finder</h1>
          <p className="muted">Pickleball courts around Atlanta</p>
        </header>
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onLocate={locate}
          locating={status === 'locating'}
          locationError={error}
        />
        <p className="muted count">
          {courts.length} {courts.length === 1 ? 'location' : 'locations'}
        </p>
        <CourtList courts={courts} selectedId={selectedId} onSelect={setSelectedId} />
      </aside>

      <main className="map-wrap">
        <CourtMap courts={courts} selectedId={selectedId} onSelect={setSelectedId} userLocation={location} />
      </main>
    </div>
  )
}
