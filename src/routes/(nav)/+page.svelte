<script lang="ts">
	export let data;
	let { session, name } = data;
</script>

<svelte:head>
	<title>Pocket Quads</title>
</svelte:head>

<main style="display: flex; justify-content: center; text-align: center;">
	<div>
		<header>
			<h1>Welcome to Pocket Quads{session && name ? `, ${name}!` : '!'}</h1>
			<hr />
		</header>
		<section>
			{#if session && !name}
				<p>Go to the Account tab to finish setting up your profile.</p>
			{:else}
				<p>This is the home page.</p>
			{/if}
			<div style="margin-top: 200px;">
				<form method="POST">
					<button style="width: 200px; font-size: 1.5em;">Play!</button>
				</form>
			</div>
		</section>
	</div>
</main>
