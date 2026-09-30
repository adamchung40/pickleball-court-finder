import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { CourtList } from './components/CourtList'
import { CourtMap } from './components/CourtMap'
import { FilterBar } from './components/FilterBar'
import { useGeolocation } from './hooks/useGeolocation'
import { fetchCourts } from './lib/api'
import { filtersFromSearchParams, searchParamsFromFilters } from './lib/filterUrl'
import { applyFilters } from './lib/filters'
import type { Filters } from './types'

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = filtersFromSearchParams(searchParams)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { location, status, error, locate } = useGeolocation()
  const {
    data: allCourts = [],
    isPending,
    error: courtsError,
  } = useQuery({
    queryKey: ['courts'],
    queryFn: fetchCourts,
  })

  const setFilters = (nextFilters: Filters) => {
    const searchOnlyChanged =
      nextFilters.search !== filters.search &&
      nextFilters.setting === filters.setting &&
      nextFilters.lightsOnly === filters.lightsOnly &&
      nextFilters.freeOnly === filters.freeOnly

    setSearchParams(
      (currentParams) => searchParamsFromFilters(currentParams, nextFilters),
      { replace: searchOnlyChanged },
    )
  }

  const courts = useMemo(() => applyFilters(allCourts, filters, location), [allCourts, filters, location])

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
        {isPending ? (
          <p className="muted count" role="status">Loading courts...</p>
        ) : courtsError && allCourts.length === 0 ? (
          <p className="empty" role="alert">Unable to load courts: {courtsError.message}</p>
        ) : (
          <>
            {courtsError && (
              <p className="empty" role="status">Showing cached courts; refresh failed: {courtsError.message}</p>
            )}
            <p className="muted count">
              {courts.length} {courts.length === 1 ? 'location' : 'locations'}
            </p>
            {allCourts.length === 0 ? (
              <p className="empty">No approved courts found in Supabase.</p>
            ) : (
              <CourtList courts={courts} selectedId={selectedId} onSelect={setSelectedId} />
            )}
          </>
        )}
      </aside>

      <main className="map-wrap">
        <CourtMap courts={courts} selectedId={selectedId} onSelect={setSelectedId} userLocation={location} />
      </main>
    </div>
  )
}
