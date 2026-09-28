import type { Court, CourtWithDistance, Filters, LatLng } from '../types'
import { distanceMiles } from './geo'

export const DEFAULT_FILTERS: Filters = {
  search: '',
  setting: 'any',
  lightsOnly: false,
  freeOnly: false,
}

export function matchesFilters(court: Court, filters: Filters): boolean {
  const q = filters.search.trim().toLowerCase()
  if (q && !`${court.name} ${court.address}`.toLowerCase().includes(q)) return false
  if (filters.setting === 'indoor' && !court.indoor) return false
  if (filters.setting === 'outdoor' && court.indoor) return false
  if (filters.lightsOnly && !court.lights) return false
  if (filters.freeOnly && !court.free) return false
  return true
}

/**
 * Filter courts, attach distance when we know the user's location,
 * and sort nearest-first (or alphabetically if location is unknown).
 */
export function applyFilters(
  courts: Court[],
  filters: Filters,
  userLocation: LatLng | null,
): CourtWithDistance[] {
  const result: CourtWithDistance[] = courts
    .filter((c) => matchesFilters(c, filters))
    .map((c) => (userLocation ? { ...c, distanceMiles: distanceMiles(userLocation, c) } : c))

  return result.sort((a, b) =>
    a.distanceMiles !== undefined && b.distanceMiles !== undefined
      ? a.distanceMiles - b.distanceMiles
      : a.name.localeCompare(b.name),
  )
}
