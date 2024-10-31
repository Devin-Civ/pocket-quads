<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);
	export let user_id: string;
	let last_heartbeat = dayjs();
	let time = dayjs();
	let elapsed_seconds: number;

	$: elapsed_seconds = time.diff(last_heartbeat, 'seconds');

	const updateHeartbeat = async () => {
		console.log('Calling updateHeartbeat'); // Debugging statement
		const { error } = await supabase.rpc('update_heartbeat', {
			p_player_id: user_id
		});

		if (error) {
			console.error(`Error updating heartbeat: ${error.message}`);
		} else {
			last_heartbeat = dayjs();
			console.log('Heartbeat updated successfully');
		}
	};

	// Set up heartbeat when the component is mounted
	onMount(() => {
		console.log('Heartbeat component mounted'); // Debugging statement
		// Send heartbeat every 10 seconds
		const heartbeatInterval = setInterval(updateHeartbeat, 10000);

		const interval = setInterval(() => {
			time = dayjs();
		}, 1000);

		// Clean up interval on component destroy
		return () => {
			console.log('Heartbeat component unmounted, clearing interval'); // Debugging statement
			clearInterval(interval);
			clearInterval(heartbeatInterval);
		};
	});
</script>

<p>Last heartbeat: {elapsed_seconds} seconds ago</p>
