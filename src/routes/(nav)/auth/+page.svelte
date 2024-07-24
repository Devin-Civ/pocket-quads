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
		<p>Note: Password changes are currently unavailable. Save yours somewhere safe.</p>
	</section>
	<form method="POST" action="?/login{redirectTo ? `&redirectTo=${redirectTo}` : ''}" use:enhance>
		<label for="email">E-mail</label>
		<input type="email" name="email" bind:value={$form.email} />

		<label for="password">Password</label>
		<input type="password" name="password" bind:value={$form.password} />
		<button>Login</button>
		<button formaction="?/signup">Sign up</button>
	</form>
</main>
