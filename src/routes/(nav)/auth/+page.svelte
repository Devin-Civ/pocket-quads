<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { page } from '$app/stores';

	export let data;
	let message: string = $page.url.searchParams.get('message') ?? '';
	let redirectTo: string = $page.url.searchParams.get('redirectTo') ?? '';
	let messageStyle: string = message.includes('successful') ? 'color: green;' : 'color: red;';

	// Client API
	const { form } = superForm(data.form);
</script>

<svelte:head>
	<title>Login / Sign up</title>
</svelte:head>
<main>
	{#if message}
		<section>
			<p class="alert" style={messageStyle}>{message}</p>
		</section>
	{/if}
	<section>
		<p>Note: Password changes are currently unavailable. Save yours somewhere safe.</p>
	</section>
	<form method="POST" action="?/login{redirectTo ? `&redirectTo=${redirectTo}` : ''}">
		<label for="email">E-mail</label>
		<input type="email" name="email" bind:value={$form.email} />

		<label for="password">Password</label>
		<input type="password" name="password" bind:value={$form.password} />
		<button>Login</button>
		<button formaction="?/signup{redirectTo ? `&redirectTo=${redirectTo}` : ''}">Sign up</button>
	</form>
</main>
