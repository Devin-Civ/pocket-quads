import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
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
	room_id: z.string().min(1, 'Room ID is required'),
	player_id: z.string().min(1, 'Player ID is required'),
	buy_in: z.number().positive('Buy-in must be greater than 0')
});

export const load = async ({ locals: { supabase } }) => {
	// Get Info from Rooms Table
	const { data, error } = await supabase.from('rooms').select('*');
	if (error) {
		console.error('Error fetching rooms:', error);
		throw new Error('Error fetching rooms');
	}
	const rooms = data;

	// Initialize Forms
	const forms = [];
	for (const room of rooms) {
		const form = await superValidate(zod(joinSchema), {
			id: room.id
		});
		forms.push(form);
	}

	return { rooms, forms };
};

export const actions = {
	createRoom: async () => {},
	joinRoom: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const roomId = formData.get('room_id');
		const buyIn: number = Number(formData.get('buy_in'));

		// Update Players Table
		const { error: playerError } = await supabase.from('players').upsert({
			room_id: roomId,
			player_id: user.id,
			stack: buyIn
		});

		if (playerError) {
			console.error('Error upserting player:', playerError);
			throw new Error('Error upserting player');
		}

		// Update rooms table

		// Subtract buy_in from user's balance
		const { data: userData, error: userError } = await supabase
			.from('users')
			.select('*')
			.eq('id', user.id);
		const userBalance = userData[0].balance;
		const { error: userUpdateError } = await supabase.from('users').upsert({
			user_id: user.id,
			balance: userBalance - buyIn
		});

		// Redirect to room
		redirect(303, `/rooms/${roomId}`);
	}
};
