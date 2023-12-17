<!--
@component Task tick icon
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	import { editing_task } from '$ts/stores';
	import { createEventDispatcher } from 'svelte';
	import { scale } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let ticked: boolean = false;
</script>

<button
	class="w-full"
	on:click={() => {
		ticked = !ticked;
		dispatch('tick');
	}}
>
	<svg class="w-full" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="15" cy="16" r="13" class="stroke-slate-400" stroke-width="3" />
		{#if ticked || true}
			<path
				d="M8 13L16 21.5L35.5 2"
				class="stroke-green-500 transition-all"
				stroke-dashoffset={ticked ? 0 : 40}
				stroke-dasharray="40"
				transition:scale
				stroke-width="4"
			/>
		{/if}
	</svg>
</button>
