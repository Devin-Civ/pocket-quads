<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Heartbeat from './Heartbeat.svelte';
	import PlayerCard from './PlayerCard.svelte';
	import { createPlayersStore } from '$lib/stores/players';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { supabase } from '$lib/supabase';
	import type { Player } from '$lib/types';

	export let data;
	let { players, room_id, user_id } = data;
	const { enhance: leaveRoomEnhance, message: leaveRoomMessage } = superForm(data.leaveRoomForm);

	const playersStore = createPlayersStore(players, room_id);

	// Derived store to sort players by seat number
	const sortedPlayersStore = derived(playersStore, ($playersStore) => {
		return $playersStore.slice().sort((a, b) => a.seat - b.seat);
	});

	// TODO: Does every move and every chat message have to persist in the DB?
	// TODO: Can we just store the moves and chat messages in memory?
	// Would enable broadcast // presence gameplay. Could build with that first,
	// then with postgres channel listening, and see which is faster.
	// TODO: Understand how the subscribe() method works, and whether
	// channel().on().subscribe() is better than a custom store (check out the two examples in $lib/stores and their usages)

	// Notes: Subscribe sets up an event handler (.on()). Thye should be unsubscribed to
	// when not needed anymore, which means that I should probably keep them in svelte
	// files, so that I can use the onMount() lifecycle hook to unsubscribe.

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
	<PlayerCard {player} />
{/each}
