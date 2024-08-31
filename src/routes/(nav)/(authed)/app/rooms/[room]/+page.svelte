<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { supabase } from '$lib/supabase';
	import Heartbeat from './Heartbeat.svelte';

	export let data;
	let { chatMessages, players, room_id } = data.room_data;
	const { user_id } = data;
	const { form, enhance, errors, message } = superForm(data.messageForm);
	const { enhance: leaveRoomEnhance, message: leaveRoomMessage } = superForm(data.leaveRoomForm);

	console.log('Rendering +page.svelte');
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
{#if $leaveRoomMessage}
	<p>{$leaveRoomMessage}</p>
{/if}
<form method="POST" action="?/sendMessage" use:enhance>
	<!-- svelte-ignore a11y-no-redundant-roles -->
	<fieldset role="group">
		<input
			type="text"
			name="content"
			placeholder="Enter your message here..."
			bind:value={$form.content}
		/>
		<button type="submit">Send</button>
	</fieldset>
	{#if $message}
		<small>{$message}</small>
	{/if}
</form>

<div>
	{#each chatMessages as chatMessage}
		<p>{chatMessage.username}: {chatMessage.content}</p>
	{/each}
</div>

<Heartbeat {user_id} />
