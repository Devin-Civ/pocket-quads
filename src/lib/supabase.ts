import type SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';

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
