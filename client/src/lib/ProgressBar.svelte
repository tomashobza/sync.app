<script lang="ts">
	export let value = 0;
	export let color = '#51E5FF';
</script>

<div class="w-full h-full rounded-full border border-[#2f2f2f] overflow-hidden">
	<div
		class="h-full border-r border-[#2f2f2f]"
		style="width: {value * 100}%; background-color: {color}"
	/>
</div>
