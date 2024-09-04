import { userSchema } from '$lib/zSchemas';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const emailSchema = userSchema.pick({ email: true });

export const load = async () => {
	const form = await superValidate(zod(emailSchema));
	return { form };
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(emailSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { data, error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
			redirectTo: 'http://localhost:5173/auth/reset-password/update-password'
		});
		if (error) {
			console.error(error);
			return message(form, `Password update failed. Please try again. ${error.message}`, {
				status: 400
			});
		} else {
			return message(form, 'Success! Check your email for a password reset link.');
		}
	}
};
