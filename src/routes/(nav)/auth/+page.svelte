<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { page } from '$app/stores';

	export let data;
	// Client API
	const { form, enhance, message } = superForm(data.form);

	let redirectTo: string = $page.url.searchParams.get('redirectTo') ?? '';
</script>

<svelte:head>
	<title>Login / Sign up</title>
</svelte:head>

<main>
	{#if $message}
		<div class:success={$page.status == 200} class:error={$page.status >= 400}>
			{$message}
		</div>
	{/if}
	<section>
		<form method="POST" action="?/login{redirectTo ? `&redirectTo=${redirectTo}` : ''}" use:enhance>
			<label for="email">E-mail</label>
			<input type="email" name="email" bind:value={$form.email} />

			<label for="password">Password</label>
			<input type="password" name="password" bind:value={$form.password} />
			<button>Login</button>
			<button formaction="?/signup">Sign up</button>
		</form>
	</section>
	<section>
		<p>Note: Password changes are currently unavailable. Store yours somewhere safe.</p>
	</section>
</main>

<style>
	.success {
		color: green;
		background-color: #e6ffe6;
		border: 1px solid green;
		padding: 10px;
		border-radius: 5px;
		margin-bottom: 10px;
	}

	.error {
		color: red;
		background-color: #ffe6e6;
		border: 1px solid red;
		padding: 10px;
		border-radius: 5px;
		margin-bottom: 10px;
	}
</style>
