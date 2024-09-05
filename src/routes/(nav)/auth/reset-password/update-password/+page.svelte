<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;
	const { form, enhance, message, errors } = superForm(data.form);
</script>

<form method="post" use:enhance>
	<input
		type="password"
		name="password"
		bind:value={$form.password}
		placeholder="Enter your new password"
	/>
	<button type="submit">Reset</button>
	{#if $message}
		<p>{$message}</p>
	{/if}
	{#if $errors.password}
		<small>{$errors.password}</small>
	{/if}
</form>
