<!--
@component Universal input
@author Anastasia Butok (xbutok00)
-->

<script lang="ts">
	// Importing the EyeIcon component from another file
	import EyeIcon from './EyeIcon.svelte';

	// Exporting 'placeholder' as a reactive variable with a default value
	export let placeholder = 'Placeholder';

	// Exporting 'type' as a reactive variable, can be either 'text' or 'password'
	export let type: 'text' | 'password' = 'text';

	// Exporting 'showPassword' to toggle password visibility, default is false
	export let showPassword = false;

	// Exporting 'value' as a reactive variable to store the input's value
	export let value: string;
</script>

<!-- Setting classes for styling: full width, white background, etc. -->
<div
	class="w-full bg-white text-[#2f2f2f] text-lg flex flex-row items-center gap-2 px-3 py-1 rounded-full"
>
	<div class="flex-shrink-0 w-6">
		<!-- Slot for inserting content before the input (like icons) -->
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
		<!-- Show button to toggle password visibility if type is 'password' -->
		<button class="flex-shrink-0 w-6" on:click={() => (showPassword = !showPassword)}>
			<!-- Using EyeIcon component to indicate visibility state -->
			<EyeIcon isOpen={!showPassword} />
		</button>
	{/if}
</div>
