import { redirect } from '@sveltejs/kit';
import { superValidate, message, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const messageSchema = z.object({
	content: z.string().min(1).max(50, 'Message must be less than 50 characters'),
	username: z.string().min(1).max(50, 'Username must be less than 50 characters')
});

const leaveSchema = z.object({});

export const load = async ({ params, locals: { supabase, user } }) => {
	// // TODO : update players table, rooms table
	// // MIGHT ACTUALLY DO IN rooms/+page.server.ts instead
	// //
	// const { error } = await supabase.from('players').upsert({
	// 	player_id: user.id,
	// 	room_id: params.room
	// 	// Use search params for is_host and buy in
	// });

	// if (error) {
	// 	console.error('Error upserting player:', error);
	// 	throw new Error('Error upserting player');
	// }

	const { data: messages, error: messagesError } = await supabase
		.from('messages')
		.select('*')
		.eq('room_id', params.room);
	const { data: players, error: playersError } = await supabase
		.from('players')
		.select('*')
		.eq('room_id', params.room);
	const { data: room, error: roomError } = await supabase
		.from('rooms')
		.select('*')
		.eq('id', params.room);

	if (messagesError || playersError || roomError) {
		console.error('Error fetching messages or players:', messagesError, playersError);
		throw new Error('Error fetching messages or players');
	}

	console.log(messages);
	const messageForm = await superValidate(zod(messageSchema));
	const leaveRoomForm = await superValidate(zod(leaveSchema));

	return {
		room_data: { id: params.room, messages, players },
		player_data: { user_id: user.id, username: user.username },
		messageForm,
		leaveRoomForm
	};
};

export const actions = {
	fold: async ({ locals: { supabase, user } }) => {
		// const { data, error } = await supabase.from('rooms').update({ folded: true }).eq('id', room.id);
	},
	check: async () => {},
	// etc
	sendMessage: async ({ request, locals: { supabase, user }, params }) => {
		const form = await superValidate(request, zod(messageSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { error } = await supabase.from('messages').insert({
			content: form.data.content,
			room_id: params.room,
			user_id: user.id,
			username: form.data.username
		});
		if (error) {
			return fail(400, { form });
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
