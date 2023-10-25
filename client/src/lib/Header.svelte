<script lang="ts">
	import { user_data } from '../ts/stores';
	import Burger from './Burger.svelte';

	export let scroll: number = 0;
	$: blur_val = Math.min(scroll / 20, 5);
	$: bg_val = Math.min(scroll / 50, 8);

	$: console.log(bg_val - 1);
</script>

<div
	class="header"
	style="backdrop-filter: blur({blur_val}px); background: linear-gradient(rgba(0,0,0,{(bg_val - 1) /
		10}), #00000000)"
>
	<div>{$user_data?.name ?? 'unknown'}</div>
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
