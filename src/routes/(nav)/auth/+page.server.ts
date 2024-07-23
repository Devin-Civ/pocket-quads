import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters long.')
});

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password
		});
		if (error) {
			console.error(error);
			return fail(400, { form, message: 'Sign-up failed. Please try again.' });
		} else {
			return {
				form,
				message: 'Sign-up successful! Please check your email to confirm your sign-up.'
			};
		}
	},
	login: async ({ request, url, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});
		if (error) {
			console.error(error);
			return fail(400, { form, message: 'Login failed. Please try again.' });
		} else {
			const redirectTo = url.searchParams.get('redirectTo');
			console.log('Redirecting to:', redirectTo); // Debugging log
			if (redirectTo) {
				return redirect(302, redirectTo);
			}
			return redirect(302, '/');
		}
	}
};

export const load = async () => {
	const form = await superValidate(zod(schema));
	return { form };
};
