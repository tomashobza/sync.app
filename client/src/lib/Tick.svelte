<!--
@component Task tick icon
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	// Importing a Svelte store
	import { editing_task } from '$ts/stores';

	// Importing Svelte's event dispatcher function
	import { createEventDispatcher } from 'svelte';

	// Importing the scale transition from Svelte for animations
	import { scale } from 'svelte/transition';

	// Creating an event dispatcher instance
	const dispatch = createEventDispatcher();

	// Exporting 'ticked' as a reactive boolean variable with a default value of false
	export let ticked: boolean = false;
</script>

<button
	class="w-full"
	on:click={() => {
		ticked = !ticked;
		dispatch('tick');
	}}
>
	<!-- SVG for the tick icon -->
	<svg class="w-full" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
		<!-- Circle element for the checkbox background -->
		<circle cx="15" cy="16" r="13" class="stroke-slate-400" stroke-width="3" />
		{#if ticked || true}
			<!-- Path element for the tick mark with conditional rendering and transition -->
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
