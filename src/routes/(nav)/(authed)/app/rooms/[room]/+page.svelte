<script lang="ts">
	import Heartbeat from './Heartbeat.svelte';
	import PlayerCard from './PlayerCard.svelte';
	import { playersStore } from '$lib/stores/players';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation'; // Import the goto function
	import type { Player, Room } from '$lib/types/general';
	import { currentRoomStore } from '$lib/stores/rooms';
	import { enhance } from '$app/forms';
	import SharedCards from './SharedCards.svelte';

	export let data;
	let { playersData, playerCardsData, roomData, user } = data;

	playersStore.init(playersData);
	if (data.playerCardsData) {
		playersStore.updatePlayerCards(user.player_id, playerCardsData.card_1, playerCardsData.card_2);
	}
	$currentRoomStore = roomData;

	let actionSeat = 0;

	// Reactive statement to compute player_have_cards
	$: players_have_cards = $playersStore.some((player) => player.has_cards);

	$: n_shared_cards = $currentRoomStore?.shared_cards?.length || 0;

	onMount(() => {
		const playersChannel = supabase
			.channel('room_players')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomData.id}` },
				(payload) => {
					switch (payload.eventType) {
						case 'INSERT':
							playersStore.addPlayer(payload.new as Player);
							break;
						case 'UPDATE':
							playersStore.updatePlayer(payload.new as Player);
							break;
						case 'DELETE':
							if (payload.old.player_id === user.player_id) {
								goto('/app');
							}
							playersStore.removePlayer(payload.old.player_id);
							break;
					}
				}
			)
			.subscribe();
		const roomChannel = supabase
			.channel('room')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomData.id}` },
				(payload) => {
					if (payload.eventType === 'UPDATE') {
						$currentRoomStore = payload.new as Room;
					} else {
						throw new Error('Unexpected event type');
					}
				}
			)
			.subscribe();
		const cardChannel = supabase
			.channel('cards')
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'player_cards',
					filter: `player_id=eq.${user.player_id}`
				},
				(payload) => {
					console.log('Card Update Detected:', payload.new);
					playersStore.updatePlayerCards(user.player_id, payload.new.card_1, payload.new.card_2);
				}
			)
			.subscribe();
		// Clean up the subscription when the component is destroyed
		return () => {
			playersChannel.unsubscribe();
			roomChannel.unsubscribe();
			cardChannel.unsubscribe();
		};
	});
</script>

<nav>
	<ul></ul>
	<ul>
		<!-- TODO: Make this pop up a modal that has the real exit room button -->
		<li>
			<form method="POST" action="?/leaveRoom">
				<button type="submit" class="secondary">Exit Room</button>
			</form>
		</li>
	</ul>
</nav>

<Heartbeat user_id={user.player_id} />

<SharedCards />

<div class="players-container">
	{#each $playersStore as player (player.player_id)}
		<div class="player-card-wrapper">
			<PlayerCard {player} {actionSeat} />
		</div>
	{/each}
</div>
{#if user.seat_number === $currentRoomStore?.button_seat}
	<div role="group" class="button-group">
		<form method="POST" action="?/deal" use:enhance>
			<input type="hidden" name="n_shared_cards" value={n_shared_cards} />
			<input type="hidden" name="players_have_cards" value={players_have_cards.toString()} />
			<button type="submit">Deal</button>
		</form>
		<form method="POST" action="?/passButton" use:enhance>
			<button type="submit">Pass Button</button>
		</form>
	</div>
{/if}

<style>
	/* Flexbox container for player cards */
	.players-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 20px; /* Add space between player cards */
	}

	/* Player card wrapper styling */
	.player-card-wrapper {
		flex: 1 1 calc(50% - 20px); /* Adjust as needed */
		box-sizing: border-box; /* Ensure padding and border are included in the width */
	}

	/* Media query for larger screens */
	@media (min-width: 768px) {
		.player-card-wrapper {
			flex: 1 1 calc(33.33% - 20px); /* Adjust as needed */
		}
	}

	/* Media query for smaller screens */
	@media (max-width: 767px) {
		.player-card-wrapper {
			flex: 1 1 100%; /* Full width for smaller screens */
		}
	}
</style>
