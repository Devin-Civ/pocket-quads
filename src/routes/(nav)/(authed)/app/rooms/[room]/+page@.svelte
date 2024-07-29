<script lang="ts">
	import Input from './Input.svelte';
	export let data: { room: string };
</script>

<nav>
	<ul></ul>
	<ul>
		<!-- TODO: Make this pop up a modal that has the real exit room button -->
		<li><a href="/app" role="button" class="secondary">Exit Room</a></li>
	</ul>
</nav>

<!-- TODO: GAME LAYOUT -->
