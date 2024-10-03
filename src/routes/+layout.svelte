<script lang="ts">
	import '@picocss/pico';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	// Lister for auth events on the client, to handle refreshes/signouts
	export let data;
	$: ({ supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (event === 'SIGNED_OUT') {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<slot />

<style>
	@font-face {
		font-family: 'Kenney Pixel';
		src: url('/fonts/kenney_pixel.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	:root {
		--pico-font-family: 'Kenney Pixel', var(--pico-font-family-sans-serif);
		--pico-font-family-sans-serif: 'Kenney Pixel', system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, Helvetica, Arial, 'Helvetica Neue', sans-serif, var(--pico-font-family-emoji);
		--pico-font-size: 200%;
		--pico-line-height: 0.5;
	}
</style>
