<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { supabase } from '$lib/supabase';
	import Heartbeat from './Heartbeat.svelte';
	import PlayerCard from './PlayerCard.svelte';
	import { createPlayersStore } from '$lib/stores/players';

	export let data;
	let { players, room_id, user_id } = data;
	const { enhance: leaveRoomEnhance, message: leaveRoomMessage } = superForm(data.leaveRoomForm);

	const playersStore = createPlayersStore(players, room_id);
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

{#each $playersStore as player}
	<PlayerCard {player} />
{/each}
