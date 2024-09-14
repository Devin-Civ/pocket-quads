<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Heartbeat from './Heartbeat.svelte';
	import PlayerCard from './PlayerCard.svelte';
	import { playersStore } from '$lib/stores/players';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation'; // Import the goto function
	import type { Player, Room } from '$lib/types';
	import { currentRoomStore } from '$lib/stores/rooms';

	export let data;
	let { players, room, user_id } = data;

	$playersStore = players;
	$currentRoomStore = room;

	// Derived store to sort players by seat number :: TODO better way to handle this
	const sortedPlayersStore = derived(playersStore, ($playersStore) => {
		return $playersStore.slice().sort((a, b) => a.seat_number - b.seat_number);
	});

	let actionSeat = 0;

	let userInPlayers = true;

	// Check if the user is in the players store
	$: {
		userInPlayers = $playersStore.some((player) => player.player_id === user_id);
		if (!userInPlayers) {
			goto('/app'); // Redirect to /app if the user is not found in the players store
		}
	}

	const user = $playersStore.find((player) => player.player_id === user_id);

	onMount(() => {
		const playersChannel = supabase
			.channel('room_players')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${room.id}` },
				(payload) => {
					console.log('playersChannel: event received', payload);
					playersStore.update((p: Player[]) => {
						switch (payload.eventType) {
							case 'INSERT':
								return [...p, payload.new as Player];
							case 'UPDATE':
								return p.map((player) =>
									player.player_id === (payload.new as Player).player_id
										? (payload.new as Player)
										: player
								);
							case 'DELETE':
								return p.filter((player) => player.player_id !== payload.old.player_id);
							default:
								return p;
						}
					});
				}
			)
			.subscribe();
		const roomChannel = supabase
			.channel('rooms')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
				(payload) => {
					console.log('roomsChannel: event received', payload);
					if (payload.eventType === 'UPDATE') {
						$currentRoomStore = payload.new as Room;
					} else {
						throw new Error('Unexpected event type');
					}
				}
			)
			.subscribe();
		// Clean up the subscription when the component is destroyed
		return () => {
			playersChannel.unsubscribe();
			roomChannel.unsubscribe();
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

<Heartbeat {user_id} />

{#each $sortedPlayersStore as player}
	<PlayerCard {player} {actionSeat} />
{/each}

{#if user?.seat_number === $currentRoomStore?.button_seat}
	<div role="group" class="button-group">
		<form method="POST" action="?/deal">
			<button type="submit">Shuffle and Deal</button>
		</form>
		<form method="POST" action="?/passButton">
			<button type="submit">Pass Button</button>
		</form>
	</div>
{/if}
