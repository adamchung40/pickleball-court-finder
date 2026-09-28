import { formatMiles } from '../lib/geo'
import type { CourtWithDistance } from '../types'

type Props = {
  courts: CourtWithDistance[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CourtList({ courts, selectedId, onSelect }: Props) {
  if (courts.length === 0) {
    return <p className="empty">No courts match those filters.</p>
  }

  return (
    <ul className="court-list">
      {courts.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            className={c.id === selectedId ? 'court-card selected' : 'court-card'}
            onClick={() => onSelect(c.id)}
          >
            <div className="court-card-top">
              <strong>{c.name}</strong>
              {c.distanceMiles !== undefined && <span className="distance">{formatMiles(c.distanceMiles)}</span>}
            </div>
            <div className="muted">{c.address}</div>
            <div className="tags">
              <span className="tag">{c.numCourts} courts</span>
              <span className="tag">{c.indoor ? 'Indoor' : 'Outdoor'}</span>
              {c.lights && <span className="tag">Lights</span>}
              <span className="tag">{c.free ? 'Free' : 'Paid'}</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
