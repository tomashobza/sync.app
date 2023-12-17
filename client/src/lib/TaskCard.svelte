<!--
@component Card for task in project
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	// Importing the 'updateTask' function from a TypeScript module
	import { updateTask } from '$ts/db';

	// Importing type definitions for Project and Task
	import type { Project, Task } from '$ts/interfaces';

	// Importing a Svelte store
	import { editing_task } from '$ts/stores';

	// Importing Svelte's event dispatcher function
	import { createEventDispatcher } from 'svelte';

	// Importing Tick and UsersProfile components
	import Tick from './Tick.svelte';
	import UsersProfile from './UsersProfile.svelte';

	// Creating an event dispatcher instance
	const dispatch = createEventDispatcher();

	// Exporting 'task' and 'project' as reactive variables
	export let task: Task;
	export let project: Project;

	// Exporting 'disabled' as a reactive variable with a default value of false
	export let disabled: boolean = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="bg-white rounded-xl text-slate-500 w-full flex-shrink-0 max-w-[15rem] h-full border-2
	border-transparent transition-all border-dashed active:border-white snap-center flex flex-col
	gap-2 p-2"
	on:click
>
	<div class="w-full flex flex-row items-center justify-between">
		<div class="w-7" class:pointer-events-none={disabled}>
			<!-- Tick component bound to the 'done' status of the task -->
			<Tick
				bind:ticked={task.done}
				on:tick={() =>
					updateTask(project?.id, task?.id, { done: !!task?.done }).then(() => {
						dispatch('tick');
					})}
			/>
		</div>
		<div class="w-8">
			<!-- UsersProfile component showing the assigned user's profile -->
			<UsersProfile
				hasBorder
				photoUrl={task?.assigned?.photoURL ? task?.assigned?.photoURL : null}
				initials={task?.assigned ? task?.assigned?.displayName[0]?.toUpperCase() : '??'}
			/>
		</div>
	</div>
	<div class="flex-grow grid place-content-center">
		<!-- Displaying the title of the task -->
		{task?.title}
	</div>
</div>
