<script>
	import { goto } from '$app/navigation';
	import PlusIcon from '$lib/PlusIcon.svelte';
	import ProjectCard from '$lib/ProjectCard.svelte';
	// import { pushShit } from '$ts/db';
	import { projects } from '$ts/stores';
</script>

<div
	class="flex flex-col items-center md:flex-row md:items-stretch md:flex-wrap md:justify-center gap-6 p-6"
>
	<!-- <button on:click={pushShit}>Send Shit</button> -->
	{#each $projects as project, i}
		<ProjectCard {project} {i} />
	{/each}

	<button
		class="focus:border-white transition-all border-dashed border border-transparent w-full rounded-3xl bg-[#ffffff33] text-white grid place-content-center py-8"
		on:click={() => goto('/project/new')}
	>
		<PlusIcon />
	</button>
</div>
