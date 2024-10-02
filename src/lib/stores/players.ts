import { writable } from 'svelte/store';
import type { Player, DB_Player } from '../types/general';

const createPlayersStore = () => {
	const { subscribe, set, update } = writable<Player[]>([]);

	const init = (players: DB_Player[]) => {
		set(players.map((p) => ({ ...p, card_1: null, card_2: null })));
	};

	const updatePlayer = (updatedPlayer: Partial<Player> & { player_id: string }) =>
		update((players) =>
			players.map((player) =>
				player.player_id === updatedPlayer.player_id ? { ...player, ...updatedPlayer } : player
			)
		);

	const updatePlayerCards = (player_id: string, card_1: string | null, card_2: string | null) =>
		update((players) =>
			players.map((player) =>
				player.player_id === player_id ? { ...player, card_1, card_2 } : player
			)
		);

	const addPlayer = (player: Player) => {
		update((players) => {
			const newPlayers = [...players, { ...player, card_1: null, card_2: null }];
			newPlayers.sort((a, b) => a.seat_number - b.seat_number);
			return newPlayers;
		});
	};

	const removePlayer = (player_id: string) => {
		update((players) => players.filter((p) => p.player_id !== player_id));
	};

	const refreshPlayers = async (supabaseClient) => {
		try {
			const { data: dbPlayers, error } = await supabaseClient
				.from('players')
				.select('*')
				.order('seat_number');

			if (error) {
				throw error;
			}

			update((currentPlayers) => {
				return dbPlayers.map((dbPlayer) => {
					const existingPlayer = currentPlayers.find((p) => p.player_id === dbPlayer.player_id);
					return {
						...dbPlayer,
						card_1: existingPlayer ? existingPlayer.card_1 : null,
						card_2: existingPlayer ? existingPlayer.card_2 : null
					};
				});
			});
		} catch (error) {
			console.error('Error refreshing players:', error);
		}
	};

	const refreshPlayerCards = async (supabaseClient, player_id: string) => {
		try {
			const { data, error } = await supabaseClient
				.from('player_cards')
				.select('card_1, card_2')
				.eq('player_id', player_id)
				.single();

			if (error) {
				throw error;
			}

			if (data) {
				update((players) =>
					players.map((player) =>
						player.player_id === player_id
							? { ...player, card_1: data.card_1, card_2: data.card_2 }
							: player
					)
				);
			}
		} catch (error) {
			console.error('Error updating current player cards:', error);
		}
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
