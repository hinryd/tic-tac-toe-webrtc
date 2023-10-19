<script lang="ts">
	import 'uno.css';
	import '@unocss/reset/tailwind-compat.css';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
</script>

{#key $page.url.pathname}
	<main transition:slide>
		<slot />
	</main>
{/key}
