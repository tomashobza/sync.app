<script lang="ts">
	export let photoUrl: string;
	export let initials: string;
</script>

<div class="w-full aspect-square rounded-full overflow-hidden">
	{#if !photoUrl}
		<div class="w-full h-full flex flex-row items-center justify-center bg-white">
			<div class="text-slate-600 font-bold">{initials}</div>
		</div>
	{:else}
		<img
			src={photoUrl}
			class="object-cover bg-center bg-white h-full object-center"
			alt="profile"
		/>
	{/if}
</div>
