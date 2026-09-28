export type Court = {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  numCourts: number
  indoor: boolean
  lights: boolean
  free: boolean
  surface: 'concrete' | 'asphalt' | 'sport-court' | 'wood'
  notes?: string
}

export type Setting = 'any' | 'indoor' | 'outdoor'

export type Filters = {
  search: string
  setting: Setting
  lightsOnly: boolean
  freeOnly: boolean
}

export type LatLng = { lat: number; lng: number }

/** A court plus its distance from the user (if we know where they are). */
export type CourtWithDistance = Court & { distanceMiles?: number }
