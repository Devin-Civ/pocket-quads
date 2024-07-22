<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;

	// Client API
	const { form } = superForm(data.form);
</script>

<svelte:head>
	<title>Login / Sign up</title>
</svelte:head>
<form method="POST" action="?/login">
	<label for="email">E-mail</label>
	<input type="email" name="email" bind:value={$form.email} />

	<label for="password">Password</label>
	<input type="password" name="password" bind:value={$form.password} />
	<button>Login</button>
	<button formaction="?/signup">Sign up</button>
</form>
