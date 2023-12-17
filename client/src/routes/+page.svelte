<!--
@component Main page
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	// Importing 'goto' for navigation
	import { goto } from '$app/navigation';

	// Importing PlusIcon and ProjectCard components
	import PlusIcon from '$lib/PlusIcon.svelte';
	import ProjectCard from '$lib/ProjectCard.svelte';

	// Importing type definition for Project
	import type { Project } from '$ts/interfaces';

	// Importing Svelte stores
	import { projects, user_data } from '$ts/stores';

	// Importing flip animation and easing function from Svelte
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	// Declaring and initializing ordered_projects as an array of Project type
	let ordered_projects: Project[] = [];

	// Reactive statement to sort projects based on user favourites and due dates
	$: if ($user_data && $projects) {
		ordered_projects = $projects.sort((a, b) => {
			// Sorting logic based on favourites and due dates
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
	{#each ordered_projects as project, i (project.id)}
		<div
			class="w-full max-w-[22rem]"
			animate:flip={{ delay: 250, duration: 250, easing: quintOut }}
		>
			<!-- ProjectCard component for each project -->
			<ProjectCard {project} {i} />
		</div>
	{/each}

	<!-- Button to add a new project -->
	<button
		class="focus:border-white max-w-[22rem] transition-all border-dashed border border-transparent w-full rounded-3xl bg-[#ffffff33] text-white grid place-content-center py-8"
		on:click={() => goto('/project/new')}
	>
		<!-- PlusIcon for visual representation -->
		<PlusIcon />
	</button>
</div>
