import { superValidate, message, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const messageSchema = z.object({
	content: z.string().min(1).max(50, 'Message must be less than 50 characters')
});

export async function load({ params, locals: { supabase, user } }) {
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

	const messages = await supabase.from('messages').select('*').eq('room_id', params.room);
	const players = await supabase.from('players').select('*').eq('room_id', params.room);

	const form = await superValidate(zod(messageSchema));

	return { room_data: { id: params.room, messages, players }, form };
}

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
			user_id: user.id
		});
		if (error) {
			return fail(400, { form });
		}
		return { form };
	}
};
