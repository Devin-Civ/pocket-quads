import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';
import { LinkedListQueue } from '$lib/utils';
import type { Deck } from '$lib/classes/deck';

class Dealer implements Dealer {
	private serviceBase: SupabaseClient;
	private roomChannel: RealtimeChannel;

	constructor(
		public roomId: string,
		cookies: Cookies
	) {
		this.serviceBase = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			cookies: {
				getAll: () => cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookies.set(name, value, { ...options, path: '/' })
					);
				}
			}
		});
		this.roomChannel = this.serviceBase.channel(this.roomId);
	}

	async queuePlayers(buttonPosition: number): Promise<LinkedListQueue<string>> {
		const { data, error } = await this.serviceBase
			.from('players')
			.select('player_id, seat')
			.eq('room_id', this.roomId)
			.eq('sitting_out', false)
			.eq('folded', false);

		if (error) {
			throw new Error('Error fetching players');
		}

		console.log('Players in this hand:', data);

		const queue = new LinkedListQueue<string>();

		if (data) {
			// Sort players by seat in ascending order
			const sortedPlayers = data.sort((a, b) => a.seat - b.seat);

			// Find the index of the player with the button position
			const buttonIndex = sortedPlayers.findIndex((player) => player.seat === buttonPosition);

			// Add players to the queue starting from the button position
			for (let i = 0; i < sortedPlayers.length; i++) {
				const index = (buttonIndex + i) % sortedPlayers.length;
				queue.enqueue(sortedPlayers[index].player_id);
			}
		}

		return queue;
	}

	async dealCards(buttonPosition: number, deck: Deck): Promise<void> {
		const queue: LinkedListQueue<string> = await this.queuePlayers(buttonPosition);
		const dealt: LinkedListQueue<string> = new LinkedListQueue<string>();

		// Deal the first card to each player
		while (queue.size() > 0) {
			const playerId = queue.dequeue();
			if (playerId) {
				const { error } = await this.serviceBase
					.from('player_cards')
					.update({ card_1: deck.dealCard() })
					.eq('player_id', playerId);

				if (error) {
					throw new Error(`Error updating card for player ${playerId}`);
				}

				dealt.enqueue(playerId);
			}
		}

		// Deal the second card to each player
		while (dealt.size() > 0) {
			const playerId = dealt.dequeue();
			if (playerId) {
				const { error } = await this.serviceBase
					.from('player_cards')
					.update({ card_2: deck.dealCard() })
					.eq('player_id', playerId);

				if (error) {
					throw new Error(`Error updating card for player ${playerId}`);
				}
			}
		}
	}

	async collectCards(): Promise<void> {
		// Implement the logic to collect cards
	}
}
