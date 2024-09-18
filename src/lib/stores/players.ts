import { writable } from 'svelte/store';
import type { Player } from '../types';

const createPlayersStore = () => {
	const { subscribe, set, update } = writable<Player[]>([]);

	const updatePlayer = (player: Player) => {
		update((players) => players.map((p) => (p.player_id === player.player_id ? player : p)));
	};
	const updatePlayerCards = (player_id: string, card_1: string | null, card_2: string | null) => {
		update((players) => {
			const updatedPlayers = players.map((p) =>
				p.player_id === player_id ? { ...p, card_1, card_2 } : p
			);
			console.log(
				`Updated current user's cards. ${updatedPlayers.find((p) => p.player_id === player_id)?.card_1} ${updatedPlayers.find((p) => p.player_id === player_id)?.card_2}`
			); // Debugging log
			return updatedPlayers;
		});
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
		removePlayer,
		updatePlayerCards
	};
};

export const playersStore = createPlayersStore();
