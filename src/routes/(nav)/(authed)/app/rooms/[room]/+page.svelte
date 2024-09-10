<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Heartbeat from './Heartbeat.svelte';
	import PlayerCard from './PlayerCard.svelte';
	import { createPlayersStore } from '$lib/stores/players';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation'; // Import the goto function
	import type { Player } from '$lib/types';

	export let data;
	let { players, room_id, user_id } = data;
	const { enhance: leaveRoomEnhance, message: leaveRoomMessage } = superForm(data.leaveRoomForm);

	const playersStore = createPlayersStore(players, room_id);

	// Derived store to sort players by seat number
	const sortedPlayersStore = derived(playersStore, ($playersStore) => {
		return $playersStore.slice().sort((a, b) => a.seat - b.seat);
	});

	let actionSeat = 0;

	// Check if the user is in the players store
	$: {
		const userInPlayers = $playersStore.some((player) => player.player_id === user_id);
		if (!userInPlayers) {
			goto('/app'); // Redirect to /app if the user is not found in the players store
		}
	}

	onMount(() => {
		const playersChannel = supabase
			.channel('room_players')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${room_id}` },
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

		// Clean up the subscription when the component is destroyed
		return () => {
			playersChannel.unsubscribe();
		};
	});
</script>

<nav>
	<ul></ul>
	<ul>
		<!-- TODO: Make this pop up a modal that has the real exit room button -->
		<li>
			<form method="POST" action="?/leaveRoom" use:leaveRoomEnhance>
				<button type="submit" class="secondary">Exit Room</button>
			</form>
		</li>
	</ul>
</nav>

<Heartbeat {user_id} />

{#each $sortedPlayersStore as player}
	<PlayerCard {player} {actionSeat} />
{/each}
