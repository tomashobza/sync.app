<!--
@component Progress bar
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	export let value = 0;
	export let color = '#51E5FF';

	export let hasWhiteBg = false;
</script>

<div class="z-0 w-full h-full relative rounded-full border border-[#2f2f2f] overflow-hidden">
	<!-- The progress bar element -->
	<div
		class="-z-10 origin-center h-full box-border border-[#2f2f2f] transition-all duration-300"
		class:border-r={value > 1}
		style="width: {value * 101}%; background-color: {color}"
	/>

	<!-- The text displaying the progress percentage -->
	<div
		class="z-0 absolute inset-0 flex flex-row items-center justify-end px-2 text-xs"
		class:text-white={!hasWhiteBg}
		class:mix-blend-difference={!hasWhiteBg}
		class:text-black={hasWhiteBg}
	>
		{Math.round(value * 100)}%
	</div>
</div>
