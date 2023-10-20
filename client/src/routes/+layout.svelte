<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/Header.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { user_data } from '../ts/stores';
	import { page } from '$app/stores';

	$: container_scroll = 0;

	onMount(() => {
		if (!$user_data) goto('/login');
	});
</script>

<div class="wrapper">
	{#if !($page?.route?.id == '/login')}
		<div class="absolute top-0 left-0 w-full">
			<Header scroll={container_scroll} />
		</div>
	{/if}
	<div
		class="w-full flex-grow overflow-auto pt-16"
		on:scroll={(e) => e?.target?.scrollTop && (container_scroll = e.target.scrollTop)}
	>
		<slot />
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply relative;
		@apply w-full h-full;
		@apply flex flex-col items-center;
	}
</style>
