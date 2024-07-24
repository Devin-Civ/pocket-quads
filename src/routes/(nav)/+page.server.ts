import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

// export const load = async ({ locals: { safeGetSession, supabase } }) => {
// 	const { session, user } = await safeGetSession();
// 	return {
// 		user,
// 		session,
// 		supabase
// 	};
// };

export const actions: Actions = {
	default: async () => {
		redirect(302, '/app');
	}
};
