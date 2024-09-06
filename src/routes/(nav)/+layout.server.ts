import type { LayoutServerLoad } from './$types';

export const load = async ({ locals: { user, supabase } }) => {
	// Fetch user's name and silver on server load
	let name = '';
	let silver = 0;
	if (user) {
		const { data, error } = await supabase
			.from('profiles')
			.select('full_name, silver')
			.eq('id', user.id)
			.single();

		if (error) {
			console.error('Error fetching username:', error);
		} else {
			if (data.full_name) {
				name = data.full_name.split(' ')[0];
			} else {
				name = 'Mr. No-Name';
			}
			silver = data.silver;
		}
	}
	return { name, silver };
};
