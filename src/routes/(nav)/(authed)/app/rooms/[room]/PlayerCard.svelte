<script lang="ts">
	import { playersStore } from '$lib/stores/players';
	import { currentRoomStore } from '$lib/stores/rooms';
	import type { Player } from '$lib/types';
	import { onDestroy } from 'svelte';
	import { derived } from 'svelte/store';

	export let player: Player;
	export let actionSeat: number; // Seat number where the action is currently

	const player_id = player.player_id;

	// Derived store to get the current player's cards reactively
	const currentPlayerStore = derived(playersStore, ($playersStore) => {
		return $playersStore.find((p) => p.player_id === player_id);
	});

	let card1: string | null = null;
	let card2: string | null = null;

	// Subscribe to the derived store to update card1 and card2 reactively
	const unsubscribe = currentPlayerStore.subscribe((currentPlayer) => {
		card1 = currentPlayer?.card_1 ?? null;
		card2 = currentPlayer?.card_2 ?? null;
		console.log('card1', card1);
		console.log('card2', card2);
	});

	onDestroy(unsubscribe);
</script>

<article class:folded={!player.has_cards} class:action-on={actionSeat === player.seat_number}>
	<div class="player-info">
		<div class="player-details">
			<p class="seat">
				Seat {player.seat_number}
				{player.seat_number === $currentRoomStore?.button_seat ? '(D)' : ''}
			</p>
			<p>Player: {player.username}</p>
			<p>Stack: {player.stack}</p>
			{#if player.current_wager}
				<p>Current Bet: {player.current_wager}</p>
			{/if}
		</div>
		<div class="player-cards">
			{#if player.has_cards}
				<img
					src={`/retro_cards/${card1 ? card1 : 'Back_2'}.png`}
					alt={card1 ?? 'Back_2'}
					class="card-image"
				/>
				<img
					src={`/retro_cards/${card2 ? card2 : 'Back_2'}.png`}
					alt={card2 ?? 'Back_2'}
					class="card-image"
				/>
			{/if}
		</div>
	</div>
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
	.player-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.player-details {
		display: flex;
		flex-direction: column;
	}
	.player-cards {
		display: flex;
	}
	.card-image {
		image-rendering: pixelated;
		margin-left: 10px;
		width: 75px;
		height: auto;
	}
</style>
