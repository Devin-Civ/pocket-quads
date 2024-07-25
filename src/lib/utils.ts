import type { RequestEvent } from '@sveltejs/kit';

export function handleLoginRedirect(
	event: RequestEvent,
	message: string = 'You must be logged in to access this page!'
) {
	const redirectTo = event.url.pathname + event.url.search;
	return `/auth?redirectTo=${encodeURIComponent(redirectTo)}&message=${encodeURIComponent(message)}`;
}
