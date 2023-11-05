<script lang="ts">
	import { editing_task } from '$ts/stores';
	import { fade, fly } from 'svelte/transition';
	import XIcon from './XIcon.svelte';
	import type { Project, Task } from '$ts/interfaces';
	import Button from './Button.svelte';
	import UsersProfile from './UsersProfile.svelte';
	import Tick from './Tick.svelte';
	import { loadProjects, removeTask, updateTask } from '$ts/db';

	let title = '';
	let assignee: string | null = null;

	editing_task.subscribe((v) => {
		if (v) {
			title = v?.task?.title;
			assignee = v?.task?.assigned?.uid;
		}
	});

	const saveTask = () => {
		if (!$editing_task?.project?.id || !assignee) return;
		updateTask($editing_task?.project?.id, $editing_task?.task?.id, {
			title,
			assigned: assignee
		});
		editing_task.set(null);
		loadProjects();
	};

	const deleteTask = () => {
		const rusure = confirm('Are you sure you want to delete this task?');
		if (!rusure) return;
		if (!$editing_task?.project?.id) return;

		removeTask($editing_task?.project?.id, $editing_task?.task?.id);
		editing_task.set(null);
		loadProjects();
	};
</script>

<dialog
	open
	class="bg-transparent inset-0 w-full h-full flex flex-col items-center justify-center z-[99]"
>
	<div
		class="bg-white p-6 rounded-3xl z-[99] flex flex-col w-full m-6 max-w-[20rem] gap-4"
		transition:fly={{ y: 100 }}
	>
		<div class="flex flex-row items-center">
			<div class="text-lg flex-grow gap-1">Edit task:</div>
			<button class="w-6" on:click={() => editing_task.set(null)}> <XIcon /></button>
		</div>
		<div class="flex flex-row items-center gap-2">
			<div class="text-slate-400">Text:</div>
			<input type="text" class="flex-grow px-2 py-2 border-b" bind:value={title} />
		</div>
		<div class="flex flex-col items-stretch gap-2 w-full">
			<div class="text-slate-400">Assignee:</div>
			<div class="flex-grow flex flex-col items-center flex-wrap gap-4 py-2">
				{#each $editing_task?.project?.members ?? [] as member}
					<button
						class="w-full rounded-full bg-white transition-all flex flex-row items-center gap-2 flex-shrink-0"
						on:click={() => {
							assignee = member?.uid;
						}}
					>
						<div class="w-10">
							<UsersProfile
								hasBorder
								photoUrl={member?.photoURL ? member?.photoURL : ''}
								initials={member ? member?.displayName[0]?.toUpperCase() : '??'}
							/>
						</div>
						<div class="flex-grow text-left truncate pl-2">{member?.displayName}</div>
						<div class="w-6">
							<Tick ticked={assignee == member?.uid} />
						</div>
					</button>
				{/each}
			</div>
		</div>

		<Button on:click={saveTask}>Save</Button>
		<Button on:click={deleteTask} color="#888">Delete task</Button>
	</div>

	<div class="absolute inset-0 bg-black opacity-50" transition:fade />
</dialog>
