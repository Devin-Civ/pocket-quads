<script lang="ts">
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';

	export let data: LayoutData;

	$: ({ user, supabase } = data);

	async function handleSignOut() {
		await supabase.auth.signOut();
		goto('/', { replaceState: true });
		location.reload(); // Refresh the page
	}
</script>

<nav>
	<ul>
		{#if user}
			<li>Silver: {data.silver}</li>
		{/if}
	</ul>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/app">Play</a></li>
		<li><a href="/account">Account</a></li>
		<!-- Add signout button -->
		{#if user}
			<li>
				<button class="outline secondary" on:click={handleSignOut}>Log Out</button>
			</li>
		{/if}
	</ul>
</nav>
<slot />
