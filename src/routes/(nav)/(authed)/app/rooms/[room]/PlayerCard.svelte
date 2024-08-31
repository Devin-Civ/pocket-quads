<script lang="ts">
	import type { Player } from '$lib/stores/players';
	export let player: Player;
</script>

<article>
	<h3>Seat {player.seat}</h3>
	<p>Player: {player.username}</p>
	<p>Chips: {player.stack}</p>
	{#if player.wager}
		<p>Current Bet: {player.wager}</p>
	{/if}
</article>
