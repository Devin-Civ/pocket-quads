import { redirect } from '@sveltejs/kit';
import type { Player } from '$lib/types/general';

export const load = async ({ params: { room }, locals }) => {
	const user_id = locals.user.id;

	// Get the room data
	const { data: roomData, error } = await locals.supabase
		.from('rooms')
		.select('*')
		.eq('id', room)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	// Get all players in the room
	const { data: playersData, error: playersError } = await locals.supabase
		.from('players')
		.select('*')
		.eq('room_id', room)
		.order('seat_number', { ascending: true });
	if (playersError) {
		throw new Error(playersError.message);
	}

	const user = playersData.find((p: Player) => p.player_id === user_id);

	// Check when loading the web page that the user is in the room
	if (!user) {
		throw redirect(303, '/app');
	}

	const { data: playerCardsData, error: playerCardsError } = await locals.supabase
		.from('player_cards')
		.select('card_1, card_2')
		.eq('player_id', user_id)
		.single();

	if (playerCardsError) {
		throw new Error(playerCardsError.message);
	}

	return {
		roomData, // the Room object of the room on load
		playersData, // the Player objects of all players in the room on load
		playerCardsData: user.has_cards ? playerCardsData : null, // the PlayerCards object of current user on load
		user // the Player object of current user on load
	};
};

export const actions = {
	fold: async () => {},
	check: async () => {},
	leaveRoom: async ({ locals: { supabase, user }, params }) => {
		let { error } = await supabase.rpc('leave_room', {
			in_player_id: user.id,
			in_room_id: params.room
		});
		return redirect(303, '/app');
	},
	deal: async ({ locals: { supabase }, params, request }) => {
		const formData = await request.formData();
		const n_shared_cards = Number(formData.get('n_shared_cards'));
		const players_have_cards = formData.get('players_have_cards') === 'true';

		console.log('players_have_cards', players_have_cards);
		console.log('n_shared_cards', n_shared_cards);

		switch (n_shared_cards) {
			case 0:
				if (!players_have_cards) {
					console.log('Shuffling and dealing');
					const { error: errorShuffling } = await supabase.rpc('shuffle_and_deal', {
						in_room_id: params.room
					});
					if (errorShuffling) {
						throw new Error(errorShuffling.message);
					}
				} else {
					console.log('Dealing flop');
					const { error: errorDealingFlop } = await supabase.rpc('deal_flop', {
						in_room_id: params.room
					});
					if (errorDealingFlop) {
						throw new Error(errorDealingFlop.message);
					}
				}
				return { success: true };
			case 3:
				console.log('Dealing turn');
				const { error: errorDealingTurn } = await supabase.rpc('deal_turn', {
					in_room_id: params.room
				});
				if (errorDealingTurn) {
					throw new Error(errorDealingTurn.message);
				}
				return { success: true };
			case 4:
				console.log('Dealing river');
				const { error: errorDealingRiver } = await supabase.rpc('deal_river', {
					in_room_id: params.room
				});
				if (errorDealingRiver) {
					throw new Error(errorDealingRiver.message);
				}
				return { success: true };
			case 5:
				console.log('Showdown!');
				return { success: true };
			default:
				throw new Error(`Invalid number of shared cards: ${n_shared_cards}`);
		}
	},
	passButton: async ({ request, locals: { supabase }, params }) => {
		const { error } = await supabase.rpc('pass_button', {
			in_room_id: params.room
		});
		return { success: true };
	}
};
