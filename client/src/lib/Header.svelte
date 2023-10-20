<script lang="ts">
	import { user_data } from '../ts/stores';
	import Burger from './Burger.svelte';

	export let scroll: number = 0;
	$: blur_val = Math.min(scroll / 20, 5);
</script>

<div class="header" style="backdrop-filter: blur({blur_val}px)">
	<div>{$user_data?.name ?? 'unknown'}</div>
	<div>
		<Burger />
	</div>
</div>

<style lang="postcss">
	.header {
		@apply w-full;
		@apply flex flex-row items-center justify-between;
		@apply py-5 px-4;
		@apply text-white;
	}
</style>
