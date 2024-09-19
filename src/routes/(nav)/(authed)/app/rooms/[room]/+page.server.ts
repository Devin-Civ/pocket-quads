import { redirect } from '@sveltejs/kit';
import type { Player } from '$lib/types';

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

	// Check if the user has cards, if so, get them
	if (user && user.has_cards) {
		const { data: playerCardsData, error: playerCardsError } = await locals.supabase
			.from('player_cards')
			.select('card_1, card_2')
			.eq('player_id', user_id)
			.single();

		if (playerCardsError) {
			throw new Error(playerCardsError.message);
		}

		user.card_1 = playerCardsData.card_1;
		user.card_2 = playerCardsData.card_2;
	}

	return {
		room: roomData, // the Room object of the room on load
		players: playersData, // the Player objects of all players in the room on load
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
	deal: async ({ locals: { supabase }, params }) => {
		const { error } = await supabase.rpc('shuffle_and_deal', {
			room_id_input: params.room
		});
		return { success: true };
	},
	passButton: async ({ request, locals: { supabase }, params }) => {
		const { error } = await supabase.rpc('pass_button', {
			room_id_input: params.room
		});
		return { success: true };
	}
};
