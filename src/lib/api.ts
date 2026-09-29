import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Court } from '../types'

let supabase: SupabaseClient | undefined

function getSupabaseClient() {
	if (supabase) return supabase

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Supabase is not configured. Check your .env.local values.')
	}

	supabase = createClient(supabaseUrl, supabaseAnonKey)
	return supabase
}

/** Fetch the courts used by the application. */
export async function fetchCourts(): Promise<Court[]> {
	const { data, error } = await getSupabaseClient()
		.from('courts')
		.select('id, name, address, lat, lng, num_courts, indoor, lights, free, surface, notes')
		.eq('approved', true)
		.order('name')

	if (error) {
		throw new Error(`Unable to fetch courts: ${error.message}`)
	}

	return (data ?? []).map((row) => ({
		id: row.id,
		name: row.name,
		address: row.address,
		lat: row.lat,
		lng: row.lng,
		numCourts: row.num_courts,
		indoor: row.indoor,
		lights: row.lights,
		free: row.free,
		surface: row.surface ?? undefined,
		notes: row.notes ?? undefined,
	}))
}
