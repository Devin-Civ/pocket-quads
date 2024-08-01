<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { page } from '$app/stores';

	export let data;

	// Client API:
	const { form, enhance, delayed, errors, constraints, message } = superForm(data.form, {
		resetForm: false,
		delayMs: 200
	});

	$: ({ user } = data);
</script>

<div class="container-fluid">
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
			<input id="email" type="text" value={user?.email} disabled />
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
				<small>{$errors.full_name}</small>
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
				<small>{$errors.username}</small>
			{/if}
		</div>
		<div>
			<input type="submit" class="button block primary" />
		</div>
	</form>
	{#if $delayed}
		<div aria-busy="true">Updating...</div>
	{/if}
	{#if $message}
		<div class:success={$page.status == 200} class:error={$page.status >= 400}>{$message}</div>
	{/if}
</div>
