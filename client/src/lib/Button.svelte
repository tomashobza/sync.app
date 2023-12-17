<!--
@component Universal button
@author Anastasia Butok (xbutok00)
-->

<script lang="ts">
	export let hasMinWidth: boolean = true;
	export let color: string = 'primary';
</script>

<button
	class=" font-semibold px-5 py-3 rounded-full shadow-md transition-all hover:scale-95 focus:scale-95 active:scale-90 text-white"
	class:bg-primary={color == 'primary'}
	style={color != 'primary' ? `background-color: ${color}` : ''}
	class:min-w-[10rem]={hasMinWidth}
	on:click
>
	<slot />
</button>
