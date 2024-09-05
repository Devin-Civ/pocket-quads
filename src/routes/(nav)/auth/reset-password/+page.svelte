<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;
	const { form, enhance, message, errors, delayed } = superForm(data.form, { resetForm: false });
</script>

<form method="post" use:enhance>
	<input
		type="email"
		name="email"
		bind:value={$form.email}
		placeholder="Enter the email associated with your account"
	/>
	<button type="submit">Send Link</button>
	{#if $delayed}
		<small>Working on it...</small>
	{/if}
	{#if $message}
		<small>{$message}</small>
	{/if}

	{#if $errors.email}
		<small>{$errors.email}</small>
	{/if}
</form>
