<script lang="ts">
	import { superForm, type SuperForm } from 'sveltekit-superforms';
	export let data;
	let stakes = '';
	let buy_in = '';
	let max_players = 9;

	const { rooms, user_id } = data;
	// High level: Imagine old style video games. (Gameboy Advance SP)
	// Format: Menu -> Game
	// Recall GramJam opening animation. Recall old loading screens
	const { enhance, message, formId, delayed } = superForm(data.form);
</script>

<h1 style="text-align: center">Room Selection</h1>
<hr />
<!-- Form for joining a lobby -->
<div class="overflow-auto">
	<form method="POST" use:enhance>
		<table>
			<thead>
				<tr
					><th>Room Owner</th><th>Players</th><th>Type</th><th>Buy-in</th><th>Blinds</th><th
						>Actions</th
					></tr
				>
			</thead>
			<tbody>
				{#each rooms as room}
					<tr>
						<td>{room.creator_username}</td>
						<td>{room.current_players}/{room.max_players}</td>
						<td>{room.currency_type}</td>
						<td>{room.max_buy_in}</td>
						<td>{room.small_blind}/{room.big_blind}</td>
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
									formaction="?/deleteRoom"
									name="id"
									value={room.id}
									on:click={() => ($formId = room.id)}
								>
									Delete
								</button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</form>
	{#if $message}
		<p>{$message}</p>
	{/if}
</div>
