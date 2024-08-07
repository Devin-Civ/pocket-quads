import type SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';

export async function safeGetSession(supabase: SupabaseClient) {
	// Notice that the follwoing code performs two checks; it gets
	// session from the client (insecure), but then validates the user
	// serverside, and will also set session to NULL if an error occurs

	const {
		data: { session }
	} = await supabase.auth.getSession();
	if (!session) {
		return { session: null, user: null };
	}

	const {
		data: { user },
		error
	} = await supabase.auth.getUser();
	if (error) {
		// JWT validation has failed
		return { session: null, user: null };
	}

	return { session, user };
}
