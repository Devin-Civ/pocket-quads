import type SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export async function safeGetSession(supabase: SupabaseClient) {
	const { data: session } = await supabase.auth.getSession();
	if (!session) {
		return { session: null, user: null };
	}
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error) {
		return { user: null, session: null };
	}

	return { user, session };
}

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
