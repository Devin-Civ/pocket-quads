import { redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
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

		// Check if the user is already in a different room
		const { data: existingPlayers, error: existingPlayerError } = await supabase
			.from('players')
			.select('room_id')
			.eq('player_id', user.id);

		if (existingPlayerError) {
			console.error('Error checking existing room status:', existingPlayerError);
			return message(form, 'Error checking existing room status');
		}

		if (existingPlayers.length > 1) {
			console.error('Multiple entries found for the user in the players table');
			return message(form, 'Multiple entries found for the user in the players table');
		}

		const existingPlayer = existingPlayers[0];

		if (existingPlayer && existingPlayer.room_id !== room_id) {
			return message(
				form,
				`You are still considered to be in room ${existingPlayer.room_id}. Please rejoin that room or wait 30 seconds.`
			);
		}
		// If the player exists and the room exists, redirect them to the room page
		if (existingPlayer && existingPlayer.room_id === room_id) {
			return redirect(303, `/app/rooms/${room_id}`);
		}

		// Fetch Room Data
		const { data: roomData, error: roomError } = await supabase
			.from('rooms')
			.select('*')
			.eq('id', room_id)
			.single();
		if (roomError) {
			return message(form, 'Error fetching room information');
		}

		// Fetch User Data
		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select(`username, ${roomData.currency_type}`)
			.eq('id', user.id)
			.single();
		if (profileError) {
			return message(form, 'Error fetching user profile');
		}

		if (!profileData.username) {
			return message(
				form,
				'Please finish setting up your profile on the Account page before joining a room.'
			);
		}

		// Check if user has enough resources to join the room
		if (profileData[roomData.currency_type] < roomData.max_buy_in) {
			return message(form, `Insufficient ${roomData.currency_type} to join the room`);
		}

		// Join Room
		let { error } = await supabase.rpc('join_room', {
			in_room_id: room_id,
			in_player_id: user.id,
			in_buy_in: roomData.max_buy_in /*Temporary*/
		});
		if (error) {
			return message(form, `Error joining room: ${error.message}`);
		}

		// Redirect to room
		return redirect(303, `/app/rooms/${room_id}`);
	}
};
