<script lang="ts">
	import { onMount } from 'svelte';

	export let data;
	let { session, supabase } = data;
	let username = '';

	onMount(async () => {
		if (session) {
			const { data, error } = await supabase
				.from('profiles')
				.select('username')
				.eq('id', session.user.id)
				.single();

			if (error) {
				console.error('Error fetching username:', error);
			} else {
				username = data.username;
			}
		}
	});
</script>

<svelte:head>
	<title>Pocket Quads</title>
</svelte:head>

<main style="display: flex; justify-content: center; text-align: center;">
	<div>
		<header>
			<h1>Welcome to Pocket Quads{session ? `, ${username}!` : '!'}</h1>
			<hr />
		</header>
		<section>
			<p>This is the home page.</p>
			<div style="margin-top: 200px;">
				<form method="POST">
					<button style="width: 200px; font-size: 1.5em;">Play!</button>
				</form>
			</div>
		</section>
	</div>
</main>
