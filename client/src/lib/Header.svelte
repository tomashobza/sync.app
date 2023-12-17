<!--
@component Top navbar with user info and menu button
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	import { fly } from 'svelte/transition';
	import { user_data } from '../ts/stores';
	import Burger from './Burger.svelte';

	export let scroll: number = 0;
	$: blur_val = Math.min(scroll / 20, 5);
	$: bg_val = Math.min(scroll / 20, 8);
</script>

<div
	class="header z-[9999]"
	style=" background: linear-gradient(rgba(52	,18, 78, {(bg_val - 1) / 10}), #00000000)"
	transition:fly={{ y: -50 }}
>
	<div>{$user_data?.displayName ?? 'unknown'}</div>
	<button on:click>
		<Burger />
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
