<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { page } from '$app/stores';

	export let data;

	// Client API:
	const { form, enhance, submitting, errors, constraints, message } = superForm(data.form, {
		resetForm: false
	});

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);
</script>

<div class="container-fluid">
	<section>
		<SuperDebug data={$form} />
	</section>
	<form
		class="form-widget"
		method="POST"
		action="?/update"
		style="text-align: left"
		use:enhance
		novalidate
	>
		<div>
			<label for="email">Email</label>
			<input id="email" type="text" value={session.user.email} disabled />
		</div>

		<div>
			<label for="full_name">Full Name</label>
			<input
				id="full_name"
				name="full_name"
				type="text"
				bind:value={$form.full_name}
				aria-invalid={$errors.full_name ? 'true' : undefined}
				{...$constraints.full_name}
			/>
			{#if $errors.full_name}
				<p class="invalid">{$errors.full_name}</p>
			{/if}
		</div>

		<div>
			<label for="username">Username</label>
			<input
				id="username"
				name="username"
				type="text"
				bind:value={$form.username}
				aria-invalid={$errors.username ? 'true' : undefined}
				{...$constraints.username}
			/>
			{#if $errors.username}
				<p class="invalid">{$errors.username}</p>
			{/if}
		</div>
		<div>
			<input
				type="submit"
				class="button block primary"
				aria-busy={$submitting}
				aria-label="Updating..."
			/>
		</div>
	</form>
	{#if $message}
		<div class:success={$page.status == 200} class:error={$page.status >= 400}>{$message}</div>
	{/if}
</div>
