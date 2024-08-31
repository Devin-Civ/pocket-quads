import { createPlayersStore } from '$lib/stores/players';
import { redirect } from '@sveltejs/kit';
import { superValidate, message, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const messageSchema = z.object({
	content: z.string().min(1).max(50, 'Message must be less than 50 characters')
});

const leaveSchema = z.object({});

export const load = async ({ params, locals: { supabase, user } }) => {
	const room_id = params.room;

	const { data: players, error: playersError } = await supabase
		.from('players')
		.select('*')
		.eq('room_id', room_id);

	const messageForm = await superValidate(zod(messageSchema));
	const leaveRoomForm = await superValidate(zod(leaveSchema));

	return {
		room_id,
		user_id: user.id,
		messageForm,
		leaveRoomForm,
		players
	};
};

export const actions = {
	fold: async ({ locals: { supabase, user } }) => {
		// const { data, error } = await supabase.from('rooms').update({ folded: true }).eq('id', room.id);
	},
	check: async () => {},
	// etc
	sendMessage: async ({ request, locals: { supabase, user, username }, params }) => {
		const form = await superValidate(request, zod(messageSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { error } = await supabase.from('messages').insert({
			room_id: params.room,
			content: form.data.content,
			user_id: user.id,
			username
		});
		if (error) {
			return message(form, `Error sending message: ${error.message}`);
		}
		return { form };
	},
	leaveRoom: async ({ request, locals: { supabase, user }, params }) => {
		const form = await superValidate(request, zod(leaveSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		let { error } = await supabase.rpc('leave_room', {
			in_player_id: user.id,
			in_room_id: params.room
		});
		if (error) {
			return message(form, `Error leaving room: ${error.message}`);
		}
		return redirect(303, '/app');
	}
};
