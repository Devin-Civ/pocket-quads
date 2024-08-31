<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;
	const { form, enhance, message, errors } = superForm(data.form);
</script>

<form method="post" use:enhance>
	<input type="password" name="password" bind:value={$form.password} placeholder="New Password" />
	<button type="submit">Reset Password</button>
	{#if message}
		<p>{message}</p>
	{/if}
	{#if errors}
		<small>{errors}</small>
	{/if}
</form>
