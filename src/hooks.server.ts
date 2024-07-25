import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleLoginRedirect } from '$lib/utils';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

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
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();

	console.log('Session:', session);
	console.log('User:', user);

	event.locals.user = user;
	event.locals.session = session;

	// Check if the route is part of the authed group
	const isAuthedGroup = event.route.id?.includes('/(authed)');

	console.log(event.route.id);

	if (!event.locals.session && isAuthedGroup) {
		console.log('!event.locals.session && isAuthedGroup');
		// Prevent redirect loop by checking if the current path is already /auth
		if (event.url.pathname !== '/auth') {
			console.log('Redirecting to login');
			return redirect(303, handleLoginRedirect(event));
		}
	}

	if (event.locals.session && event.url.pathname.startsWith('/auth')) {
		return redirect(303, '/app');
	}

	return resolve(event);
};

export const handle = sequence(supabase, authGuard);
