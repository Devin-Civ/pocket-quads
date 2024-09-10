<script lang="ts">
	import type { Player } from '$lib/types';
	export let player: Player;
	export let actionSeat: number; // Seat number where the action is currently
</script>

<article class:folded={player.is_folded} class:action-on={actionSeat === player.seat}>
	<h3>Seat {player.seat}</h3>
	<p>Player: {player.username}</p>
	<p>Stack: {player.stack}</p>
	{#if player.wager}
		<p>Current Bet: {player.wager}</p>
	{/if}
</article>

<style>
	.folded {
		opacity: 0.5;
	}
	.action-on {
		border: 2px solid green;
	}
</style>
