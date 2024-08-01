import type { LayoutServerLoad } from './$types';

// Get access to auth token on the server
export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	return {
		user,
		session,
		cookies: cookies.getAll()
	};
};
