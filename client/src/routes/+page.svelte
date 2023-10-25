<script>
	import ProjectCard from '$lib/ProjectCard.svelte';
	import { projects } from '$ts/stores';
</script>

<div
	class="flex flex-col items-center md:flex-row md:items-stretch md:flex-wrap md:justify-center gap-6 p-6"
>
	{#each $projects as project, i}
		<ProjectCard {project} {i} />
	{/each}
</div>
