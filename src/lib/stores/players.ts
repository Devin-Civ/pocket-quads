import { writable } from 'svelte/store';
import { supabase } from '../supabase';

export interface Player {
	// Define the structure of a player object
	id: string;
	username: string;
	stack: number;
	wager: number;
	seat: number;
	sitting_out: boolean;
	is_folded: boolean;
}

export function createPlayersStore(initialPlayers: Player[], room_id: string) {
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
