import { fail, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const profileSchema = z.object({
	full_name: z
		.string({ invalid_type_error: 'Please enter your name' })
		.min(1, ' Full Name is required')
		.refine((val) => val.trim().split(/\s+/).length >= 2, {
			message: ' Please use your first and last name'
		}),
	username: z
		.string({ invalid_type_error: 'Please enter a username' })
		.min(3, ' Username must contain at least three characters')
		.max(10, ' Username must not exceed 10 characters')
		.regex(/^[A-Za-z0-9]+$/, ' Username can only contain A-Z, a-z, 0-9')
});

export const load = async ({ locals: { supabase, user } }) => {
	const { data, error: queryError } = await supabase
		.from('profiles')
		.select(`username, full_name`)
		.eq('id', user.id)
		.single();

	if (queryError) {
		console.error('Error fetching profile:', queryError);
		throw error(500, 'Error fetching profile');
	}

	const profile = data;
	const form = await superValidate(profile, zod(profileSchema));

	return { profile, form };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase, user } }) => {
		const form = await superValidate(request, zod(profileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Check if the username already exists
		const { count } = await supabase
			.from('profiles')
			.select('username', { count: 'exact', head: true })
			.eq('username', form.data.username)
			.neq('id', user?.id);

		if (count > 0) {
			return message(form, 'Username already exists!', { status: 400 });
		}

		const { error } = await supabase.from('profiles').upsert({
			id: user?.id,
			full_name: form.data.full_name,
			username: form.data.username,
			updated_at: new Date()
		});

		if (error) {
			return fail(500, { form });
		}

		return message(form, 'Profile updated!');
	}
};
