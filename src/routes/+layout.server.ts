import type { LayoutServerLoad } from './$types';

// Get access to auth token on the server
export const load: LayoutServerLoad = async ({ locals: { session }, cookies }) => {
	return {
		session,
		cookies: cookies.getAll()
	};
};
