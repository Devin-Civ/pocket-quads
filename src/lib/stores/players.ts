import { writable } from 'svelte/store';
import { supabase } from '../supabase';
import type { Player } from '../types';

export function createPlayersStore(initialPlayers: Player[]) {
	const { subscribe, set } = writable(initialPlayers);

	const fetchPlayers = async (room_id: string) => {
		const { data, error } = await supabase.from('players').select('*').eq('room_id', room_id);

		if (error) {
			console.error('Error fetching players:', error);
		} else {
			set(data as Player[]);
		}
	};

	return {
		subscribe,
		refresh: fetchPlayers
	};
}
