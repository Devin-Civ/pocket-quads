<script lang="ts">
	import { currentRoomStore } from '$lib/stores/rooms';
	import type { Room } from '$lib/types/general';

	if (!$currentRoomStore) {
		throw new Error('Current room store is not available');
	}
</script>

{#if $currentRoomStore.shared_cards}
	<article class="flex flex-col items-center justify-center">
		<h1>Shared Cards</h1>
		{#each $currentRoomStore.shared_cards as card}
			<img src={`/retro_cards/${card ? card : 'Back_2'}.png`} alt={card} class="card-image" />
		{/each}
	</article>
{/if}

<style>
	.card-image {
		image-rendering: pixelated;
		margin-left: 10px;
		width: 75px;
		height: auto;
	}
</style>
