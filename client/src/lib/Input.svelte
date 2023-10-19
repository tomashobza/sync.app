<script lang="ts">
	import EyeIcon from './EyeIcon.svelte';

	export let placeholder = 'Placeholder';
	export let type: 'text' | 'password' = 'text';
	export let showPassword = false;

	export let value: string;
	$: console.log(value);
</script>

<div
	class="w-full bg-white text-[#2f2f2f] text-lg flex flex-row items-center gap-2 px-3 py-1 rounded-full"
>
	<div class="flex-shrink-0 w-6">
		<slot />
	</div>
	<input
		class="flex-grow"
		size="1"
		type={type == 'text' ? type : showPassword ? 'text' : 'password'}
		{placeholder}
		on:input={(e) => e?.target?.value && (value = e.target.value)}
	/>
	{#if type == 'password'}
		<button class="flex-shrink-0 w-6" on:click={() => (showPassword = !showPassword)}>
			<EyeIcon isOpen={!showPassword} />
		</button>
	{/if}
</div>
