<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	export let data;
	const { messages, players, id: room_id } = data.room_data;
	const { form, enhance, errors } = superForm(data.messageForm);
	const {
		enhance: leaveRoomEnhance,
		message: leaveRoomMessage,
		errors: leaveRoomErrors
	} = superForm(data.leaveRoomForm);
	const { user_id, username } = data.player_data;

	const roomChannel = data.supabase.channel(`${data.room_data.id}`);
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
				console.log(payload);
				const { content, username } = payload.new;
				messages.push({ username, content });
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
<form method="post" action="?/sendMessage" use:enhance>
	<!-- svelte-ignore a11y-no-redundant-roles -->
	<fieldset role="group">
		<input
			type="text"
			name="content"
			placeholder="Enter your message here..."
			bind:value={$form.content}
		/>
		<input type="hidden" name="username" value={username} />
		<button type="submit">Send</button>
	</fieldset>
	{#if $errors.content}
		<small>{$errors.content}</small>
	{/if}
</form>
<div>
	{#each messages as message}
		<p>{message.content}</p>
	{/each}
</div>
