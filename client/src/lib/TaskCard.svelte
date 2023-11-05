<script lang="ts">
	import { updateTask } from '$ts/db';
	import type { Project, Task } from '$ts/interfaces';
	import { editing_task } from '$ts/stores';
	import { createEventDispatcher } from 'svelte';
	import Tick from './Tick.svelte';
	import UsersProfile from './UsersProfile.svelte';

	const dispatch = createEventDispatcher();

	export let task: Task;
	export let project: Project;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="bg-white rounded-xl text-slate-500 w-full flex-shrink-0 max-w-[15rem] h-full border-2 border-transparent transition-all border-dashed active:border-white snap-center flex flex-col gap-2 p-2"
	on:click
>
	<div class="w-full flex flex-row items-center justify-between">
		<div class="w-7">
			<Tick
				bind:ticked={task.done}
				on:tick={() =>
					!$editing_task &&
					updateTask(project?.id, task?.id, { done: !!task?.done }).then(() => {
						dispatch('tick');
					})}
			/>
		</div>
		<div class="w-8">
			<UsersProfile
				hasBorder
				photoUrl={task?.assigned?.photoURL ? task?.assigned?.photoURL : null}
				initials={task?.assigned ? task?.assigned?.displayName[0]?.toUpperCase() : '??'}
			/>
		</div>
	</div>
	<div class="flex-grow grid place-content-center">
		{task?.title}
	</div>
</div>
