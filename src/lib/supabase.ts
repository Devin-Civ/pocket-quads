import type SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export async function safeGetSession(supabase: SupabaseClient) {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error || !user) {
		return { user: null };
	}

	return { user };
}

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
