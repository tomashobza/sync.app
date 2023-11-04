<script lang="ts">
	export let value = 0;
	export let color = '#51E5FF';
</script>

<div class="z-0 w-full h-full relative rounded-full border border-[#2f2f2f] overflow-hidden">
	<div
		class="-z-10 h-full border-r border-[#2f2f2f]"
		style="width: {value * 100}%; background-color: {color}"
	/>

	<div
		class="-z-10 absolute inset-0 flex flex-row items-center justify-end px-2 text-xs"
		class:text-black={color != '#fff'}
		class:text-white={color == '#fff'}
	>
		{Math.round(value * 100)}%
	</div>
</div>
