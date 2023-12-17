<!--
@component Top navbar of the detail page with back button
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	import { fly } from 'svelte/transition';
	import ChevronLeft from './ChevronLeft.svelte';
	import { goto } from '$app/navigation';

	export let scroll: number = 0;
	$: blur_val = Math.min(scroll / 20, 5); // Calculate the blur value based on the scroll position
	$: bg_val = Math.min(scroll / 50, 8); // Calculate the background value based on the scroll position
</script>

<div
	class="header"
	style="backdrop-filter: blur({blur_val}px); background: linear-gradient(rgba(52	,18, 78, {(bg_val -
		1) /
		10}), #00000000)"
	transition:fly={{ y: -50 }}
>
	<button on:click={() => goto('/')}>
		<ChevronLeft />
	</button>
</div>

<style lang="postcss">
	.header {
		@apply w-full;
		@apply flex flex-row items-center justify-between;
		@apply py-5 px-4;
		@apply text-white;
	}
</style>
