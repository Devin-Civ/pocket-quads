<script lang="ts">
	import { onMount } from 'svelte';
	export let data;
	let { user, name } = data;
	let randomSentence = '';

	onMount(async () => {
		const response = await fetch('/api/generateSentence', {
			method: 'POST'
		});
		const data = await response.json();

		if (data.error) {
			console.error(data.error);
		} else {
			randomSentence = data.randomSentence;
		}
	});
</script>

<svelte:head>
	<title>Pocket Quads</title>
</svelte:head>

<main style="display: flex; justify-content: center; text-align: center;">
	<div>
		<header>
			<h1>Welcome back{user && name ? `, ${name}` : '!'}</h1>
			<hr />
		</header>
		<section>
			{#if user && !name}
				<p>Go to the Account tab to finish setting up your profile.</p>
			{:else if randomSentence}
				<p style="max-width: 600px; margin: 0 auto;">{randomSentence}</p>
			{:else}
				<h2>...</h2>
			{/if}
			<div style="margin-top: 2rem;">
				<form method="POST">
					<button style="width: 200px; font-size: 1.5em;">Play!</button>
				</form>
			</div>
		</section>
	</div>
</main>

<style>
	main {
		--pico-border-radius: 2rem;
		--pico-typography-spacing-vertical: 1.5rem;
		--pico-form-element-spacing-vertical: 1rem;
		--pico-form-element-spacing-horizontal: 1.25rem;
	}
</style>
