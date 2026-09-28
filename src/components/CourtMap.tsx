import { useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import type { CourtWithDistance, LatLng } from '../types'

const ATLANTA: [number, number] = [33.7756, -84.3963]

type Props = {
  courts: CourtWithDistance[]
  selectedId: string | null
  onSelect: (id: string) => void
  userLocation: LatLng | null
}

/** Pans the map when the selected court or user location changes. */
function FlyTo({ target }: { target: LatLng | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 13), { duration: 0.6 })
  }, [target, map])
  return null
}

export function CourtMap({ courts, selectedId, onSelect, userLocation }: Props) {
  const selected = courts.find((c) => c.id === selectedId) ?? null

  return (
    <MapContainer center={ATLANTA} zoom={11} className="map">
      {/* Free OpenStreetMap tiles — no API key needed. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {courts.map((c) => (
        <CircleMarker
          key={c.id}
          center={[c.lat, c.lng]}
          radius={c.id === selectedId ? 12 : 8}
          pathOptions={{ color: '#1f6f43', fillColor: c.id === selectedId ? '#f2c14e' : '#3fa66a', fillOpacity: 0.9 }}
          eventHandlers={{ click: () => onSelect(c.id) }}
        >
          <Popup>
            <strong>{c.name}</strong>
            <br />
            {c.numCourts} courts · {c.indoor ? 'Indoor' : 'Outdoor'} · {c.free ? 'Free' : 'Paid'}
            {c.notes && (
              <>
                <br />
                {c.notes}
              </>
            )}
          </Popup>
        </CircleMarker>
      ))}

      {userLocation && (
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={7}
          pathOptions={{ color: '#fff', fillColor: '#2563eb', fillOpacity: 1, weight: 2 }}
        >
          <Popup>You are here</Popup>
        </CircleMarker>
      )}

      <FlyTo target={selected ?? userLocation} />
    </MapContainer>
  )
}
