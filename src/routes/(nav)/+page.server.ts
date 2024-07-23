import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async () => {
// 	return {};
// };

export const actions: Actions = {
	default: async () => {
		redirect(302, '/app');
	}
};
