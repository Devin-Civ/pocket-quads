import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ fetch }) => {
	return {
		randomSentence: fetch('/api/generateSentence', {
			method: 'POST'
		})
	};
};

export const actions: Actions = {
	default: async () => {
		redirect(302, '/app');
	}
};
