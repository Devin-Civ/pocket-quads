import { redirect } from '@sveltejs/kit';
import type { Player } from '$lib/types';

export const load = async ({ params: { room }, locals }) => {
	const user_id = locals.user.id;
	const { data: roomData, error } = await locals.supabase
		.from('rooms')
		.select('*')
		.eq('id', room)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	const { data: playersData, error: playersError } = await locals.supabase
		.from('players')
		.select('*')
		.eq('room_id', room)
		.order('seat_number', { ascending: true });

	if (playersError) {
		throw new Error(playersError.message);
	}

	if (!playersData.some((p: Player) => p.player_id === user_id)) {
		throw redirect(303, '/app');
	}

	return {
		room: roomData,
		players: playersData,
		user_id
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
