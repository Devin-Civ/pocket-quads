<script lang="ts">
	import { superForm, type SuperForm } from 'sveltekit-superforms';
	export let data;
	let stakes = '';
	let buy_in = '';
	let max_players = 9;

	const { forms, rooms } = data;

	type FormStates = {
		[key: string]: SuperForm<any, any>;
	};

	// Initialize Forms
	let formStates: FormStates = {};
	rooms.forEach((room: { id: number }) => {
		formStates[String(room.id)] = superForm(forms[room.id]);
	});
</script>

<div class="container-fluid">
	<section style="width: 50%">
		<h1>Rooms:</h1>
		<hr />
		<aside>
			<nav>
				<ul>
					{#each rooms as room}
						<li>
							<form method="post" action="?/joinRoom">
								<input type="hidden" name="room_id" value={room.id} />
								<input type="hidden" name="buy_in" value={room.buy_in} />
								<button type="submit" class="secondary outline"
									>Join {room.creator_username}'s Room</button
								>
							</form>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>
	</section>
	<!-- TODO: MAKE ZOD FORM -->
	<section>
		<form method="POST" action="?/createRoom">
			<details class="dropdown">
				<!-- svelte-ignore a11y-no-redundant-roles -->
				<summary role="button" class="secondary">Create Room</summary>
				<ul>
					<!-- <li>
						<p>Max number of players: {max_players}</p>
						<input type="range" name="max_players" min="2" max="9" bind:value={max_players} />
					</li> -->
					<li>
						<select name="stakes" aria-label="Stakes" required bind:value={stakes}>
							<option selected disabled value="">Select the stakes you want to play...</option>
							<!-- TODO add user cutomization here or store in DB -->
							<option>1 / 2 Blinds, 50 - 200 Buy in</option>
							<option>5 / 10 Blinds, 250 - 1000 Buy in</option>
						</select>
					</li>
					{#if stakes}
						<li>
							<input
								type="number"
								name="buy_in"
								placeholder="Enter your buy in amount:"
								required
								bind:value={buy_in}
							/>
						</li>
						{#if buy_in}
							<li>
								<button type="submit">Create</button>
							</li>
						{/if}
					{/if}
				</ul>
			</details>
		</form>
	</section>
</div>
