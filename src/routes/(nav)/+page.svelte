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
				<hr />
			{/if}
		</header>
		<section>
			{#if !user}
				<h2>welcome to pocket-quads!</h2>
				<p>a simple texas hold'em poker game</p>

				<p>
					Notice: This site is still under construction, so there may be bugs and major changes are
					planned for the interface.
				</p>
			{:else}
				{#await randomSentence}
					<h2>...</h2>
				{:then response}
					<p style="max-width: 600px;">
						{response.randomSentence}
					</p>
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
		letter-spacing: 1px;
	}
	p {
		--pico-typography-spacing-vertical: 1.5rem;
		line-height: 0.8;
		letter-spacing: 1px;
	}
</style>
