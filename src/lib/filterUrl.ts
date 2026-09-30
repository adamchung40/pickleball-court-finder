import { DEFAULT_FILTERS } from './filters'
import type { Filters, Setting } from '../types'

const SETTINGS: Setting[] = ['any', 'indoor', 'outdoor']

export function filtersFromSearchParams(params: URLSearchParams): Filters {
  const setting = params.get('setting')

  return {
    search: params.get('q') ?? DEFAULT_FILTERS.search,
    setting: SETTINGS.includes(setting as Setting) ? (setting as Setting) : DEFAULT_FILTERS.setting,
    lightsOnly: params.get('lights') === '1',
    freeOnly: params.get('free') === '1',
  }
}

export function searchParamsFromFilters(params: URLSearchParams, filters: Filters): URLSearchParams {
  const next = new URLSearchParams(params)
  const search = filters.search

  if (search) next.set('q', search)
  else next.delete('q')

  if (filters.setting === 'any') next.delete('setting')
  else next.set('setting', filters.setting)

  if (filters.lightsOnly) next.set('lights', '1')
  else next.delete('lights')

  if (filters.freeOnly) next.set('free', '1')
  else next.delete('free')

  return next
}