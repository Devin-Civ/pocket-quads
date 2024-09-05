import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleLoginRedirect } from '$lib/utils';
import { safeGetSession } from '$lib/supabase';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

// This handle function creates a supabase client for each request
// and defines a way for the rest of the application to access
// session/user data securely

const supabase: Handle = async ({ event, resolve }) => {
	// Create a Supabase client specific to this request
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const session = await safeGetSession(event.locals.supabase);
		if (session?.user) {
			const { data: profile } = await event.locals.supabase
				.from('profiles')
				.select('username')
				.eq('id', session.user.id)
				.single();

			if (profile) {
				event.locals.username = profile.username;
			}
		}
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { user } = await event.locals.safeGetSession();

	event.locals.user = user;

	// Check if the route is part of the authed group
	const isAuthedGroup = event.route.id?.includes('/(authed)');

	// If the user is not authenticated and the route is part of the authed group, redirect to the login page
	if (!event.locals.user && isAuthedGroup) {
		// Prevent redirect loop by checking if the current path is already /auth
		if (!event.url.pathname.startsWith('/auth')) {
			return redirect(303, handleLoginRedirect(event));
		}
	}

	if (event.locals.user && event.url.pathname === '/auth') {
		console.log('authGuard: User authenticated, redirecting to /app');
		return redirect(303, '/app');
	}

	console.log('authGuard: End');
	return resolve(event);
};

const roomAccessGuard: Handle = async ({ event, resolve }) => {
	const { user } = await event.locals.safeGetSession();

	// Check if the URL contains the room slug parameter
	const roomSlug = event.params.room;

	// Bypass the check for joinRoom action
	if (event.url.pathname.includes('/joinRoom')) {
		return resolve(event);
	}

	if (user && roomSlug) {
		const { data: player } = await event.locals.supabase
			.from('players')
			.select('room_id')
			.eq('player_id', user.id)
			.eq('room_id', roomSlug)
			.single();

		if (!player) {
			// Redirect to a different page if the user doesn't have access to the room
			return redirect(303, '/app');
		}
	}

	return resolve(event);
};

export const handle = sequence(supabase, authGuard, roomAccessGuard);
