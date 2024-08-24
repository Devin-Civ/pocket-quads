<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	export let data;
	const { messages, players, id } = data.room_data;
	const { form, enhance, errors } = superForm(data.form);

	const roomChannel = data.supabase.channel(`${data.room_data.id}`);
	roomChannel
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'messages',
				filter: `room_id=eq.${data.room_data.id}`
			},
			(payload) => {
				const { user_id, content } = payload.new;
				const player = players.find((player: { id: any }) => player.id === user_id);
				const username = player ? player.username : 'Unknown';
				messages.push({ username, content });
			}
		)
		.subscribe();
</script>

<form method="post" action="?/sendMessage" use:enhance>
	<!-- svelte-ignore a11y-no-redundant-roles -->
	<fieldset role="group">
		<input type="text" name="content" bind:value={$form.content} />
		<button type="submit">Send</button>
	</fieldset>
	{#if $errors.content}
		<small>{$errors.content}</small>
	{/if}
</form>

{#each messages as message}
	<p>{message.username}: {message.content}</p>
{/each}
