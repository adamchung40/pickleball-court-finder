import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchCourts } from './lib/api'

export default function CourtDetailPage() {
  const { courtId } = useParams<{ courtId: string }>()
  const { data: courts = [], isPending, error } = useQuery({
    queryKey: ['courts'],
    queryFn: fetchCourts,
  })

  if (isPending) {
    return <main className="detail-page" role="status">Loading court details...</main>
  }

  if (error) {
    return (
      <main className="detail-page">
        <Link className="back-link" to="/">Back to courts</Link>
        <p className="error" role="alert">Unable to load court details: {error.message}</p>
      </main>
    )
  }

  const court = courts.find((item) => item.id === courtId)
  if (!court) {
    return (
      <main className="detail-page">
        <Link className="back-link" to="/">Back to courts</Link>
        <h1>Court not found</h1>
        <p className="muted">This court may have been removed or is not approved for listing.</p>
      </main>
    )
  }

  const directionsUrl = new URL('https://www.google.com/maps/dir/')
  directionsUrl.search = new URLSearchParams({
    api: '1',
    destination: `${court.lat},${court.lng}`,
  }).toString()

  return (
    <main className="detail-page">
      <Link className="back-link" to="/">Back to courts</Link>
      <header className="detail-header">
        <div>
          <p className="muted">Atlanta court details</p>
          <h1>{court.name}</h1>
          <p className="muted">{court.address}</p>
        </div>
        <a className="directions-link" href={directionsUrl.toString()} target="_blank" rel="noreferrer">
          Directions
        </a>
      </header>

      <dl className="court-facts">
        <div>
          <dt>Courts</dt>
          <dd>{court.numCourts}</dd>
        </div>
        <div>
          <dt>Setting</dt>
          <dd>{court.indoor ? 'Indoor' : 'Outdoor'}</dd>
        </div>
        <div>
          <dt>Lighting</dt>
          <dd>{court.lights ? 'Lights available' : 'No lights listed'}</dd>
        </div>
        <div>
          <dt>Cost</dt>
          <dd>{court.free ? 'Free' : 'Paid'}</dd>
        </div>
        {court.surface && (
          <div>
            <dt>Surface</dt>
            <dd>{court.surface}</dd>
          </div>
        )}
        <div>
          <dt>Coordinates</dt>
          <dd>{court.lat}, {court.lng}</dd>
        </div>
      </dl>

      {court.notes && (
        <section className="court-notes">
          <h2>Notes</h2>
          <p>{court.notes}</p>
        </section>
      )}
    </main>
  )
}
