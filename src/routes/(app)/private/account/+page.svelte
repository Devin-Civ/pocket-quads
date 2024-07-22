<!-- src/routes/account/+page.svelte -->

<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;
	export let form;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	let profileForm: HTMLFormElement;
	let loading = false;

	const handleSubmit: SubmitFunction = ({ result }) => {
		loading = true;
		return async () => {
			if (result.type === 'success') {
				// Handle successful form submission
			}
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = ({ result }) => {
		loading = true;
		return async ({ update }) => {
			if (result.type === 'success') {
				// Handle successful sign out
				update();
			}
			loading = false;
		};
	};
</script>

<div class="form-widget">
	<form
		class="form-widget"
		method="post"
		action="?/update"
		use:enhance={superForm(form, handleSubmit)}
		bind:this={profileForm}
	>
		<div>
			<label for="email">Email</label>
			<input id="email" type="text" value={session.user.email} disabled />
		</div>

		<div>
			<label for="fullName">Full Name</label>
			<input id="fullName" name="fullName" type="text" bind:value={form.data.fullName} />
		</div>

		<div>
			<label for="username">Username</label>
			<input id="username" name="username" type="text" bind:value={form.data.username} />
		</div>

		<div>
			<label for="website">Website</label>
			<input id="website" name="website" type="url" bind:value={form.data.website} />
		</div>

		<div>
			<input
				type="submit"
				class="button block primary"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>
	</form>

	<form method="post" action="?/signout" use:enhance={superForm(form, handleSignOut)}>
		<div>
			<button class="button block" disabled={loading}>Sign Out</button>
		</div>
	</form>
</div>
