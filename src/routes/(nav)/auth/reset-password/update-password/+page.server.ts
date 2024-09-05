import { userSchema } from '$lib/zSchemas';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const passwordSchema = userSchema.pick({ password: true });

export const load = async () => {
	const form = await superValidate(zod(passwordSchema));
	return { form };
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(passwordSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { error } = await supabase.auth.updateUser({
			password: form.data.password
		});
		if (error) {
			console.error(error);
			return message(form, `Password update failed: ${error.message}`, { status: 400 });
		} else {
			return message(form, 'Password update successful!');
		}
	}
};
