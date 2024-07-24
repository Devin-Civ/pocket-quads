import { fail, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const profileSchema = z.object({
	full_name: z
		.string()
		.min(1, ' Full Name is required')
		.refine((val) => val.trim().split(/\s+/).length >= 2, {
			message: ' Please use your first and last name'
		}),
	username: z
		.string()
		.min(3, ' Username must contain at least three characters')
		.regex(/^[A-Za-z0-9]+$/, ' Username can only contain A-Z, a-z, 0-9')
});

export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { data, error: queryError } = await supabase
		.from('profiles')
		.select(`username, full_name`)
		.eq('id', session.user.id)
		.single();

	if (queryError) {
		console.error('Error fetching profile:', queryError);
		throw error(500, 'Error fetching profile');
	}

	const profile = data;

	console.log(profile);

	const form = await superValidate(profile, zod(profileSchema));

	return { session, profile, form };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase, safeGetSession }, cookies }) => {
		const form = await superValidate(request, zod(profileSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { session } = await safeGetSession();

		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
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
