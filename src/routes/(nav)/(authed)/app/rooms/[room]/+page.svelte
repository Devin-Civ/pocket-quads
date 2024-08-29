<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	export let data;
	let { chatMessages, players, room_id } = data.room_data;
	const { form, enhance, errors, message } = superForm(data.messageForm);
	const {
		enhance: leaveRoomEnhance,
		message: leaveRoomMessage,
		errors: leaveRoomErrors
	} = superForm(data.leaveRoomForm);
	const { user_id } = data.player_data;

	const roomChannel = data.supabase.channel(room_id);
	roomChannel
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'messages',
				filter: `room_id=eq.${room_id}`
			},
			(payload: any) => {
				const { content, username } = payload.new;
				chatMessages = [...chatMessages, { content, username }];
			}
		)
		.subscribe();
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
