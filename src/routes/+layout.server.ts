// Get access to auth token on the server
export const load = async ({ locals: { safeGetSession }, cookies }) => {
	const { user } = await safeGetSession();

	return {
		user,
		cookies: cookies.getAll()
	};
};
