<script lang="ts">
	import { currentRoomStore } from '$lib/stores/rooms';
	import type { Room } from '$lib/types/general';

	if (!$currentRoomStore) {
		throw new Error('Current room store is not available');
	}

	const totalCards = 5;
</script>

<article class="flex flex-col items-center justify-center shared-cards-container">
	{#if $currentRoomStore.shared_cards}
		{#each $currentRoomStore.shared_cards as card}
			<img src={`/retro_cards/${card ? card : 'Back_2'}.png`} alt={card} class="card-image" />
		{/each}
		{#each Array(totalCards - $currentRoomStore.shared_cards.length) as _}
			<div class="card-placeholder"></div>
		{/each}
	{:else}
		{#each Array(totalCards) as _}
			<div class="card-placeholder"></div>
		{/each}
	{/if}
</article>

<style>
	.shared-cards-container {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 20px; /* Adjust as needed */
	}

	.card-image {
		image-rendering: pixelated;
		margin-left: 10px;
		width: 70px;
		height: auto;
	}

	.card-placeholder {
		width: 70px;
		height: 98px; /* Adjust height as needed */
		border: 2px solid white;
		background-color: transparent;
		margin-left: 10px;
		opacity: 0.5;
		border-radius: 5px;
		box-shadow:
			0 0 0 1px white,
			0 0 0 2px transparent;
	}
</style>
