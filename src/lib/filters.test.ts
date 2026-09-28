import { describe, expect, it } from 'vitest'
import type { Court } from '../types'
import { applyFilters, DEFAULT_FILTERS, matchesFilters } from './filters'
import { distanceMiles } from './geo'

const base: Court = {
  id: 'x',
  name: 'Test Courts',
  address: 'Atlanta, GA',
  lat: 33.75,
  lng: -84.39,
  numCourts: 4,
  indoor: false,
  lights: true,
  free: true,
  surface: 'concrete',
}

describe('distanceMiles', () => {
  it('is zero for the same point', () => {
    expect(distanceMiles(base, base)).toBe(0)
  })

  it('is roughly 69 miles per degree of latitude', () => {
    const d = distanceMiles({ lat: 33, lng: -84 }, { lat: 34, lng: -84 })
    expect(d).toBeGreaterThan(68)
    expect(d).toBeLessThan(70)
  })
})

describe('matchesFilters', () => {
  it('matches everything with default filters', () => {
    expect(matchesFilters(base, DEFAULT_FILTERS)).toBe(true)
  })

  it('searches name and address, case-insensitive', () => {
    expect(matchesFilters(base, { ...DEFAULT_FILTERS, search: 'atlanta' })).toBe(true)
    expect(matchesFilters(base, { ...DEFAULT_FILTERS, search: 'decatur' })).toBe(false)
  })

  it('filters indoor / outdoor', () => {
    expect(matchesFilters(base, { ...DEFAULT_FILTERS, setting: 'outdoor' })).toBe(true)
    expect(matchesFilters(base, { ...DEFAULT_FILTERS, setting: 'indoor' })).toBe(false)
  })

  it('filters lights and free', () => {
    const paidDark = { ...base, lights: false, free: false }
    expect(matchesFilters(paidDark, { ...DEFAULT_FILTERS, lightsOnly: true })).toBe(false)
    expect(matchesFilters(paidDark, { ...DEFAULT_FILTERS, freeOnly: true })).toBe(false)
  })
})

describe('applyFilters', () => {
  const near = { ...base, id: 'near', name: 'Zed Near', lat: 33.751 }
  const far = { ...base, id: 'far', name: 'Alpha Far', lat: 34.2 }

  it('sorts alphabetically without a location', () => {
    expect(applyFilters([near, far], DEFAULT_FILTERS, null).map((c) => c.id)).toEqual(['far', 'near'])
  })

  it('sorts nearest-first and attaches distance with a location', () => {
    const result = applyFilters([far, near], DEFAULT_FILTERS, { lat: 33.75, lng: -84.39 })
    expect(result.map((c) => c.id)).toEqual(['near', 'far'])
    expect(result[0].distanceMiles).toBeLessThan(1)
  })
})
