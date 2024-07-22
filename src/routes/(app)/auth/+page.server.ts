import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6)
});

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		const { error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password
		});
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/');
		}
	},
	signup: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/private/lobbies');
		}
	}
};

export const load = async () => {
	const form = await superValidate(zod(schema));
	return { form };
};
