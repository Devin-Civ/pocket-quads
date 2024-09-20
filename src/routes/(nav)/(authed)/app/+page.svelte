<script lang="ts">
	import { superForm, type SuperForm } from 'sveltekit-superforms';
	export let data;
	import { supabase } from '$lib/supabase';
	import { roomsStore } from '$lib/stores/rooms';
	import { onMount } from 'svelte';
	import type { Room } from '$lib/types/general.js';

	const { user_id } = data;
	const { enhance, message, formId, delayed } = superForm(data.form);

	// Initialize the rooms store with the initial data
	$roomsStore = data.rooms;

	onMount(() => {
		const roomChannel = supabase
			.channel('rooms')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, (payload) => {
				roomsStore.update((rooms: Room[]) => {
					switch (payload.eventType) {
						case 'INSERT':
							return [...rooms, payload.new as Room];
						case 'UPDATE':
							const updatedRoom = rooms.find((room) => room.id === payload.new.id);
							if (updatedRoom) {
								updatedRoom.current_players = payload.new.current_players;
							}
							return rooms;
						case 'DELETE':
							return rooms.filter((room) => room.id !== payload.old.id);
					}
				});
			})
			.subscribe();

		// Clean up the subscription when the component is destroyed
		return () => {
			roomChannel.unsubscribe();
		};
	});
</script>

<h1 style="text-align: center">Room Selection</h1>
<hr />
<!-- Form for joining a lobby -->
<div class="overflow-auto">
	<form method="POST" use:enhance>
		<table>
			<thead>
				<tr>
					<th>Actions</th>
					<th>Room Owner</th>
					<th>Players</th>
					<th>Type</th>
					<th>Buy-in</th>
					<th>Blinds</th>
				</tr>
			</thead>
			<tbody>
				{#each $roomsStore as room}
					<tr>
						<td>
							<button
								formaction="?/joinRoom"
								name="room_id"
								value={room.id}
								on:click={() => ($formId = room.id)}
								aria-busy={$delayed && $formId === room.id}
								>{#if $delayed && $formId === room.id}
									Joining...
								{:else}
									Join
								{/if}</button
							>
							{#if room.creator_id === user_id}
								<button
									style="background-color: #8B0000; margin-left: .75rem;"
									class="secondary"
									formaction="?/deleteRoom"
									name="id"
									value={room.id}
									on:click={() => ($formId = room.id)}
								>
									Delete
								</button>
							{/if}
						</td>
						<td>{room.creator_username}</td>
						<td>{room.current_players}/{room.max_players}</td>
						<td>{room.currency_type}</td>
						<td>{room.max_buy_in}</td>
						<td>[ {room.small_blind} | {room.big_blind} ]</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</form>
	{#if $message}
		<p>{$message}</p>
	{/if}
</div>
