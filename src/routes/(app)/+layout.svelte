<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/lobbies">Play</a></li>
		<li><a href="/account">Account</a></li>
	</ul>
</nav>

<slot />
