<script lang="ts">
	import { enhance } from '$app/forms';
	export let data;
	let stakes = '';
	let buy_in = '';
	let max_players = 9;
</script>

<div class="container-fluid">
	<section style="width: 50%">
		<h1>Rooms:</h1>
		<hr />
		<aside>
			<nav>
				<ul>
					{#each data.rooms as room}
						<li>
							<a href="/app/rooms/{room.creator_username}" role="button" class="outline secondary"
								>{room.creator_username} ({room.current_players}/{room.max_players})</a
							>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>
	</section>
	<!-- TODO: MAKE ZOD FORM -->
	<section>
		<form method="POST" action="?/createRoom" use:enhance>
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
