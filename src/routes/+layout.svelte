<script lang="ts">
	import '@picocss/pico';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	// Lister for auth events on the client, to handle refreshes/signouts
	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
