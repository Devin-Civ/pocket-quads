import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ fetch, locals: { user } }) => {
	let joke: string =
		"There are 10 types of people in the world: those who understand binary and those who don't.";
	if (!user) {
		let jokeObject = await fetch('/api/joke').then((response) => response.json());
		joke = jokeObject.joke;
	}
	return {
		randomSentence: fetch('/api/generateSentence', {
			method: 'POST'
		}).then((response) => response.json()),
		joke
	};
};

export const actions: Actions = {
	default: async () => {
		redirect(302, '/app');
	}
};
