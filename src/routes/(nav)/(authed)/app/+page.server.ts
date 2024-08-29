import { redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { ZodSchema } from 'zod';

// TODO: ZOD SCHEMA
// const roomSchema: ZodSchema = z.object({
// 	max_players: z
// 		.number({ invalid_type_error: 'Please enter the maximum number of players' })
// 		.int()
// 		.min(2, 'Maximum players must be at least 2')
// 		.max(10, 'Maximum players must be at most 10'),
// 	min_buy_in: z
// 		.number({ invalid_type_error: 'Please enter the minimum buy-in amount' })
// 		.positive('Minimum buy-in must be greater than 0'),
// 	max_buy_in: z
// 		.number({ invalid_type_error: 'Please enter the maximum buy-in amount' })
// 		.refine((val, ctx) => val >= ctx.parent.min_buy_in, {
// 			message: 'Maximum buy-in must be greater than or equal to the minimum buy-in'
// 		}),
// 	small_blind: z
// 		.number({ invalid_type_error: 'Please enter the small blind value' })
// 		.min(0, 'Small blind must be at least 0')
// 		.refine((val, ctx) => val <= ctx.parent.max_buy_in, {
// 			message: 'Small blind must be less than or equal to the maximum buy-in'
// 		}),
// 	big_blind: z
// 			.number({ invalid_type_error: 'Please enter the big blind value' })
// 			.refine((val, ctx) => val >= ctx.parent.small_blind, {
// 				message: 'Big blind must be greater than or equal to the small blind'
// 			})
// 			.refine((val, ctx) => val <= ctx.parent.max_buy_in, {
// 				message: 'Big blind must be less than or equal to the maximum buy-in'
// 			}),
// 	username: z
// 		.string({ invalid_type_error: 'Please enter your username' })
// 		.min(1, 'Username is required'),
// 	buy_in: z
// 		.number({ invalid_type_error: 'Please enter your buy-in amount' })
// 		.superRefine((val, ctx) => {
// 			if (val < ctx.parent.min_buy_in || val > ctx.parent.max_buy_in) {
// 				ctx.addIssue({
// 					code: z.ZodIssueCode.custom,
// 					message: 'Buy-in amount must be between the minimum and maximum buy-in amounts'
// 				});
// 			}
// 		)
// });

const joinSchema: ZodSchema = z.object({
	room_id: z.string().min(1, 'Room ID is required')
});

export const load = async ({ locals: { supabase, user } }) => {
	// Get Info from Rooms Table
	const { data, error } = await supabase.from('rooms').select('*');
	if (error) {
		console.error('Error fetching rooms:', error);
		throw new Error('Error fetching rooms');
	}
	const rooms = data;

	const form = await superValidate(zod(joinSchema));

	return { rooms, form, user_id: user.id };
};

export const actions = {
	createRoom: async () => {},
	joinRoom: async ({ request, locals: { supabase, user } }) => {
		// Determine room ID
		const form = await superValidate(request, zod(joinSchema));
		if (!form.valid) {
			return message(form, 'Invalid form');
		}
		const formData = form.data as { room_id: string };
		const { room_id } = formData;

		// Fetch Room Data
		const { data: roomData, error: roomError } = await supabase
			.from('rooms')
			.select('*')
			.eq('id', room_id)
			.single();

		if (roomError) {
			return message(form, 'Error fetching room information');
		}

		// Check for room currency type
		let resource;
		if (roomData.currency_type === 'silver') {
			resource = 'silver';
		} else if (roomData.currency_type === 'gold') {
			resource = 'gold';
		} else {
			return message(form, 'Invalid room type');
		}

		// Fetch User Data
		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select(`username, ${resource}`)
			.eq('id', user.id)
			.single();

		if (profileError) {
			return message(form, 'Error fetching user profile');
		}

		// Check if user has enough resources to join the room
		if (profileData[resource] < roomData.max_buy_in) {
			return message(form, `Insufficient ${resource} to join the room`);
		}

		let { error } = await supabase.rpc('join_room', {
			in_room_id: room_id,
			in_player_id: user.id,
			in_buy_in: roomData.max_buy_in /*Temporary*/
		});

		if (error) {
			return message(form, `Error joining room: ${error.message}`);
		}

		// // Make sure a seat is available, then reserve it
		// // TODO: assign seat number
		// console.log(room_id);
		// let { data, error } = await supabase.rpc('reserve_seat', { room_id });
		// if (error) {
		// 	return message(form, `Error joining room: ${error.message}`);
		// }
		// // We've successfully updated the number of players in the room
		// // Now update players table
		// const { error: upsertError } = await supabase.from('players').upsert({
		// 	player_id: user.id,
		// 	stack: roomData.max_buy_in,
		// 	room_id: room_id,
		// 	username: profileData.username,
		// 	seat: 42
		// });

		// if (upsertError) {
		// 	return message(form, 'Error updating player information');
		// }

		// // Update the user's resource quantity
		// const { error: updateError } = await supabase
		// 	.from('profiles')
		// 	.update({ [resource]: profileData[resource] - roomData.max_buy_in })
		// 	.eq('id', user.id);

		// if (updateError) {
		// 	return message(form, 'Error updating user resource quantity');
		// }

		// Redirect to room
		return redirect(303, `/app/rooms/${room_id}`);
	}
};
