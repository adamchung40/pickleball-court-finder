import { useCallback, useState } from 'react'
import type { LatLng } from '../types'

type Status = 'idle' | 'locating' | 'ready' | 'error'

/** Asks the browser for the user's location only when `locate()` is called. */
export function useGeolocation() {
  const [location, setLocation] = useState<LatLng | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error')
      setError('Your browser does not support location.')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('ready')
        setError(null)
      },
      (err) => {
        setStatus('error')
        setError(err.code === err.PERMISSION_DENIED ? 'Location permission denied.' : 'Could not get your location.')
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    )
  }, [])

  return { location, status, error, locate }
}
