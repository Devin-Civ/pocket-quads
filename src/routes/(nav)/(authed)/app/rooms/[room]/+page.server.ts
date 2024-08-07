export function load({ params, locals }) {
	const public_supabase = locals.supabase;

	return { room_data: { name: params.room } };
}

export const actions = {
	fold: async ({ locals: { supabase, user } }) => {
		// const { data, error } = await supabase.from('rooms').update({ folded: true }).eq('id', room.id);
	},
	check: async () => {}
	// etc
};
