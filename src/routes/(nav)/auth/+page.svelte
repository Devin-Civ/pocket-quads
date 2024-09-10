<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { page } from '$app/stores';

	export let data;
	// Client API
	const { form, enhance, message, errors } = superForm(data.form);

	let redirectTo: string = $page.url.searchParams.get('redirectTo') ?? '';
</script>

<svelte:head>
	<title>Login / Sign up</title>
</svelte:head>

<main>
	<p>
		You must sign up or log in before playing, so that your chips can be recorded. <br />
		Passwords are securely encrypted and your email is ONLY used for sign up confirmation/resetting your
		password.
	</p>
	{#if $message}
		<div class:success={$page.status == 200} class:error={$page.status >= 400}>
			{$message}
		</div>
	{/if}
	<section>
		<form method="POST" action="?/login{redirectTo ? `&redirectTo=${redirectTo}` : ''}" use:enhance>
			<label for="email">E-mail</label>
			<input type="email" name="email" bind:value={$form.email} />
			{#if $errors.email}
				<small>{$errors.email}</small>
			{/if}

			<label for="password">Password</label>
			<input type="password" name="password" bind:value={$form.password} />
			{#if $errors.password}
				<small>{$errors.password}</small>
			{/if}
			<button>Login</button>
			<button formaction="?/signup">Sign up</button>
		</form>
	</section>
	<section>
		<p>Forgot your password? <a href="/auth/reset-password">Reset it here</a>.</p>
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
