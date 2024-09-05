import type { LayoutServerLoad } from './$types';

export const load = async ({ locals: { supabase, safeGetSession }, cookies }) => {
	const { user, session } = await safeGetSession();

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
			console.error('Error fetching user info:', error);
		} else {
			name = data.full_name.split(' ')[0];
			silver = data.silver;
		}
	}
	return { name, silver, user, cookies: cookies.getAll(), session };
};
