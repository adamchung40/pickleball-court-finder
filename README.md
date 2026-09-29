# Pickleball Court Finder

A map of pickleball courts around Atlanta that you can filter by indoor/outdoor, lights and free/paid, and sort by distance from you.

**Stack:** Vite · React 19 · TypeScript · Leaflet (OpenStreetMap, no API key) · Vitest. Supabase and Vercel come in later phases.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest in watch mode
npm run build    # type-check + production build
npm run lint
```

## What already works (Phase 1)

- Map with a marker for each court. Click a marker or a list card to select that court.
- Search by name or area, plus filters for indoor/outdoor, lights and free.
- **Near me** button: uses browser geolocation and sorts courts by distance (haversine formula).
- Responsive layout: sidebar next to the map on desktop, stacked on phones.
- Unit tests for the filtering and distance logic.

> ⚠️ `src/data/courts.ts` is **sample data** with placeholder names and approximate locations. Replace it with real courts you've verified.

## Project structure

```
src/
  types.ts                 # Court, Filters, LatLng types
  data/courts.ts           # sample courts (replace with real data / DB in Phase 2)
  lib/geo.ts               # distanceMiles(), formatMiles()
  lib/filters.ts           # matchesFilters(), applyFilters() — pure, tested
  lib/filters.test.ts
  hooks/useGeolocation.ts  # browser location with loading/error state
  components/
    FilterBar.tsx
    CourtList.tsx
    CourtMap.tsx           # react-leaflet map + markers + fly-to
  App.tsx                  # owns state: filters, selected court, location
supabase/schema.sql        # DB tables + row-level security for later phases
```

**Design rule:** keep logic in `lib/` as pure functions with tests, and keep components thin.

## Roadmap

### Phase 1: Local MVP ✅ (you are here)
- [X] Run it, read every file, and change something small (colors, a new filter) to learn how the pieces fit together.
- [X] Replace the sample data with 10–15 real Atlanta courts you've checked.
- [X] Push to GitHub and deploy to Vercel (import repo → Framework: Vite → Deploy).

### Phase 2: Real data (Supabase)
- [X] Create a free Supabase project and run `supabase/schema.sql`.
- [X] `npm i @supabase/supabase-js`. Add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to `.env.local` (git-ignored).
- [X] Write `src/lib/api.ts` → `fetchCourts()`. In `App.tsx`, swap `SAMPLE_COURTS` for fetched data and add loading/error states.
- [ ] Optional: add TanStack Query for caching.

### Phase 3: Court detail and routing
- [ ] `npm i react-router-dom`. Add a `/courts/:id` page showing details, notes and a "Directions" link (`https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`).
- [ ] Put the filters in the URL query string so filtered views can be shared.

### Phase 4: User submissions
- [ ] Supabase Auth (magic link or Google).
- [ ] "Add a court" form: click the map to set lat/lng, validate the form (try `zod`), and insert with `approved = false`.
- [ ] Simple admin view to approve submissions.

### Phase 5: "Who's playing now"
- [ ] Check-in button on a court. It inserts into `check_ins` and expires after 2 hours.
- [ ] Show live counts on markers using Supabase Realtime subscriptions.

### Phase 6: Polish for your portfolio
- [ ] Marker clustering (`react-leaflet-cluster`) once there are many courts.
- [ ] Make it a PWA so it's installable on your phone at the courts.
- [ ] Accessibility pass (keyboard navigation, labels, contrast) and Lighthouse score.
- [ ] React Testing Library component tests and a GitHub Actions CI job running `npm test` + `npm run build`.
- [ ] README screenshots/GIF and a live demo link.

## Interview talking points
- Why distance logic lives in pure, tested functions (haversine).
- Row-level security in Postgres rather than trusting the client.
- Trade-offs between OpenStreetMap/Leaflet and Google Maps (cost, API keys, features).
- How check-ins expire, and real-time updates.
