import { json } from '@sveltejs/kit';
import jokes from '$lib/jokes.json';

export const GET = async () => {
	const randomIndex = Math.floor(Math.random() * jokes.jokes.length);
	const randomJoke = jokes.jokes[randomIndex];
	return json(randomJoke);
};
