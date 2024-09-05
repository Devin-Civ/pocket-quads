import type { LayoutServerLoad } from './$types';

// Get access to auth token on the server
export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { user } = await safeGetSession();

	return {
		user,
		cookies: cookies.getAll()
	};
};
