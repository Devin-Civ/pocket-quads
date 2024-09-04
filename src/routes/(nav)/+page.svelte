<script lang="ts">
	export let data;
	let { user, name, randomSentence } = data;
</script>

<svelte:head>
	<title>Pocket Quads</title>
</svelte:head>

<main style="display: flex; justify-content: center; text-align: center;">
	<div>
		<header>
			{#if user && name}
				<h1>Welcome back, {name}!</h1>
			{:else}
				<h1>Welcome!</h1>
			{/if}
			<hr />
		</header>
		<section>
			{#if !user}
				<p>Go to the Account tab to finish setting up your profile.</p>
			{:else}
				{#await randomSentence}
					<h2>...</h2>
				{:then}
					<p style="max-width: 600px; margin: 0 auto;">{randomSentence}</p>
				{:catch}
					<p>Nothing to see here!</p>
				{/await}
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
