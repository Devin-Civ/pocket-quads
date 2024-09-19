import { writable } from 'svelte/store';
import type { Player, DB_Player } from '../types';

const createPlayersStore = () => {
	const { subscribe, set, update } = writable<Player[]>([]);

	const init = (players: DB_Player[]) => {
		set(players.map((p) => ({ ...p, card_1: p.card_1 ?? null, card_2: p.card_2 ?? null })));
	};

	const updatePlayer = (player: Player) => {
		update((players) => players.map((p) => (p.player_id === player.player_id ? player : p)));
	};

	const updatePlayerCards = (player_id: string, card_1: string | null, card_2: string | null) => {
		update((players) => {
			const updatedPlayers = players.map((p) => {
				if (p.player_id === player_id) {
					p.card_1 = card_1;
					p.card_2 = card_2;
					return p;
				} else {
					return p;
				}
			});
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
		init,
		updatePlayer,
		addPlayer,
		removePlayer,
		updatePlayerCards
	};
};

export const playersStore = createPlayersStore();
