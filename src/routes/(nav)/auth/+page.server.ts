import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/zSchemas';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const schema = userSchema;

export const load = async () => {
	const form = await superValidate(zod(schema));
	return { form };
};

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
			return message(form, 'Sign-up failed. Please try again.', { status: 400 });
		} else {
			return message(form, 'Sign-up successful! Please check your email to confirm your sign-up.');
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
			return message(form, `Login failed. Please try again. ${error.message}`, { status: 400 });
		} else {
			const redirectTo = url.searchParams.get('redirectTo');
			if (redirectTo) {
				return redirect(302, redirectTo);
			}
			return redirect(302, '/');
		}
	}
};
