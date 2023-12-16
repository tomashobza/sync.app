<script lang="ts">
	import { goto } from '$app/navigation';
	import PlusIcon from '$lib/PlusIcon.svelte';
	import ProjectCard from '$lib/ProjectCard.svelte';
	import type { Project } from '$ts/interfaces';
	// import { pushShit } from '$ts/db';
	import { projects, user_data } from '$ts/stores';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	let ordered_projects: Project[] = [];
	$: if ($user_data?.favourites && $projects) {
		console.log('change');
		ordered_projects = $projects.sort((a, b) => {
			if ($user_data?.favourites?.includes(a.id) && !$user_data?.favourites?.includes(b.id))
				return -1;
			if (!$user_data?.favourites?.includes(a.id) && $user_data?.favourites?.includes(b.id))
				return 1;
			return a.duedate.getDate() - b.duedate.getDate();
		});
	}
</script>

<div
	class="flex flex-col items-center md:flex-row md:items-stretch md:flex-wrap md:justify-center gap-6 p-6"
>
	<!-- <button on:click={pushShit}>Send Shit</button> -->
	{#each ordered_projects as project, i (project.id)}
		<div
			class="w-full max-w-[22rem]"
			animate:flip={{ delay: 250, duration: 250, easing: quintOut }}
		>
			<ProjectCard {project} {i} />
		</div>
	{/each}

	<button
		class="focus:border-white max-w-[22rem] transition-all border-dashed border border-transparent w-full rounded-3xl bg-[#ffffff33] text-white grid place-content-center py-8"
		on:click={() => goto('/project/new')}
	>
		<PlusIcon />
	</button>
</div>
