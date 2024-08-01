import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ locals: { supabase, user } }) => {
	let name = '';
	if (user) {
		const { data, error } = await supabase
			.from('profiles')
			.select('full_name')
			.eq('id', user.id)
			.single();

		if (error) {
			console.error('Error fetching username:', error);
		} else {
			name = data.full_name.split(' ')[0];
		}
	}
	return { name };
};

export const actions: Actions = {
	default: async () => {
		redirect(302, '/app');
	}
};
