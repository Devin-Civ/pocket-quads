<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	export let user_id: string;

	const updateHeartbeat = async () => {
		console.log('Calling updateHeartbeat'); // Debugging statement
		const { error } = await supabase.rpc('update_heartbeat', {
			p_player_id: user_id
		});

		if (error) {
			console.error(`Error updating heartbeat: ${error.message}`);
		} else {
			console.log('Heartbeat updated successfully');
		}
	};

	// Set up heartbeat when the component is mounted
	onMount(() => {
		console.log('Heartbeat component mounted'); // Debugging statement
		// Send heartbeat every 10 seconds
		const heartbeatInterval = setInterval(updateHeartbeat, 10000);

		// Clean up interval on component destroy
		return () => {
			console.log('Heartbeat component unmounted, clearing interval'); // Debugging statement
			clearInterval(heartbeatInterval);
		};
	});
</script>
