<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<section class="container-fluid">
	<h1>Lobbies</h1>
	<form method="POST" action="?/createLobby" use:enhance>
		<button>+ Create Lobby</button>
	</form>
</section>
