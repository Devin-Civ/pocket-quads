import { writable } from 'svelte/store';
import type { Player } from '../types';

const createPlayersStore = () => {
	const { subscribe, set, update } = writable<Player[]>([]);

	const updatePlayer = (player: Player) => {
		update((players) => players.map((p) => (p.player_id === player.player_id ? player : p)));
	};

	const addPlayer = (player: Player) => {
		update((players) => {
			const newPlayers = [...players, player];
			newPlayers.sort((a, b) => a.seat_number - b.seat_number);
			return newPlayers;
		});
	};

	const removePlayer = (player_id: string) => {
		update((players) => players.filter((p) => p.player_id !== player_id));
	};

	return {
		subscribe,
		set,
		updatePlayer,
		addPlayer,
		removePlayer
	};
};

export const playersStore = createPlayersStore();
