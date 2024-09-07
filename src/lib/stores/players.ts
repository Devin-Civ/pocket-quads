import { writable } from 'svelte/store';
import { supabase } from '../supabase';
import type { Player } from '../types';

export function createPlayersStore(initialPlayers: Player[], room_id: string) {
	const { subscribe, set, update } = writable(initialPlayers);

	const fetchPlayers = async () => {
		const { data, error } = await supabase.from('players').select('*').eq('room_id', room_id);

		if (error) {
			console.error('Error fetching players:', error);
		} else {
			set(data as Player[]);
		}
	};

	return {
		subscribe,
		refresh: fetchPlayers,
		update
	};
}
