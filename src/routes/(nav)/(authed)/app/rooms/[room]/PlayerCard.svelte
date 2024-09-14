<script lang="ts">
	import type { Player } from '$lib/types';
	import { currentRoomStore } from '$lib/stores/rooms';
	export let player: Player;
	export let actionSeat: number; // Seat number where the action is currently
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
			{#if player.card_1}
				<img src={`/retro_cards/${player.card_1}.png`} alt={player.username} class="player-image" />
			{/if}
			{#if player.card_2}
				<img src={`/retro_cards/${player.card_2}.png`} alt={player.username} class="player-image" />
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
	.player-image {
		margin-left: 10px;
		width: 75px;
		height: auto;
	}
</style>
