import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS } from './filters'
import { filtersFromSearchParams, searchParamsFromFilters } from './filterUrl'

describe('filter URL parameters', () => {
  it('parses active filters and defaults invalid values', () => {
    expect(filtersFromSearchParams(new URLSearchParams('q=Atlanta&setting=indoor&lights=1&free=1'))).toEqual({
      search: 'Atlanta',
      setting: 'indoor',
      lightsOnly: true,
      freeOnly: true,
    })
    expect(filtersFromSearchParams(new URLSearchParams('setting=invalid&lights=true'))).toEqual(DEFAULT_FILTERS)
  })

  it('serializes active filters, removes defaults, and preserves other parameters', () => {
    const params = searchParamsFromFilters(
      new URLSearchParams('court=123&setting=outdoor'),
      { search: '  Atlanta  ', setting: 'indoor', lightsOnly: true, freeOnly: false },
    )

    expect(params.get('court')).toBe('123')
    expect(params.get('q')).toBe('  Atlanta  ')
    expect(params.get('setting')).toBe('indoor')
    expect(params.get('lights')).toBe('1')
    expect(params.has('free')).toBe(false)

    const defaults = searchParamsFromFilters(params, DEFAULT_FILTERS)
    expect(Array.from(defaults.entries())).toEqual([['court', '123']])
  })
})