<script lang="ts">
	import { onMount } from 'svelte';
	import type { Player } from '$lib/types';
	import { currentRoomStore } from '$lib/stores/rooms';
	export let player: Player;
	export let actionSeat: number; // Seat number where the action is currently
</script>

<article class:folded={!player.has_cards} class:action-on={actionSeat === player.seat_number}>
	<p class="seat">
		Seat {player.seat_number}
		{player.seat_number === $currentRoomStore?.button_seat ? '(D)' : ''}
	</p>
	<p>Player: {player.username}</p>
	<p>Stack: {player.stack}</p>
	{#if player.current_wager}
		<p>Current Bet: {player.current_wager}</p>
	{/if}
</article>

<style>
	.seat {
		font-weight: bold;
		font-size: smaller;
		color: grey;
	}
	.folded {
		opacity: 0.5;
	}
	.action-on {
		border: 2px solid green;
	}
</style>
