<!--
@component Card overview of a project
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	import type { Project } from '$ts/interfaces';
	import dayjs from 'dayjs';
	import ProgressBar from './ProgressBar.svelte';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import WarningIcon from './WarningIcon.svelte';
	import { goto } from '$app/navigation';
	import Star from './Star.svelte';
	import { user_data } from '$ts/stores';
	import { addFavouriteProject, removeFavouriteProject } from '$ts/db';
	import { getColorFromString } from '$ts/utils';

	// Define the available colors for the project card
	const colors = ['#51E5FF', '#FDE74C', '#EC368D'];

	// Define the index of the project card
	export let i = 0;

	// Define the project object
	export let project: Project;

	// Calculate the difference in days between the project's due date and the current date
	$: day_diff = dayjs(project?.duedate).diff(dayjs(), 'day');

	// Determine whether to show the warning icon based on the remaining days until the due date
	$: show_warning = day_diff < 7;

	// Initialize the flag for showing the project card
	let showCard = false;

	// Set the showCard flag to true after the component is mounted
	onMount(() => (showCard = true));

	// Handle the click event on the favorite button
	const favouriteHandle = (e: MouseEvent) => {
		e.stopPropagation();
		if (!$user_data?.uid) return;
		if ($user_data?.favourites?.includes(project?.id)) {
			removeFavouriteProject($user_data?.uid, project?.id);
			$user_data?.favourites?.splice($user_data?.favourites?.indexOf(project?.id), 1);
		} else {
			addFavouriteProject($user_data?.uid, project?.id);
			$user_data?.favourites?.push(project?.id);
		}
	};

	// Calculate the progress of the project based on the number of completed tasks
	$: progress = project?.tasks?.filter((t) => t.done).length / project?.tasks?.length || 0;
</script>

{#if showCard}
	<!-- Renders a button element with specific styling and event handling. -->
	<button
		class="bg-[#ffffff33] w-full max-w-[22rem] rounded-3xl text-left transition-all hover:scale-[.98] flex flex-col items-stretch"
		in:scale={{ delay: i * 50 }}
		on:click={() => goto(`/project/${project?.id}`)}
	>
		<!-- Renders the project card content. -->
		<div
			class="w-full p-6 bg-white rounded-3xl flex flex-col items-stretch gap-2 text-[#2F2F2F] card flex-grow"
		>
			<div class="flex flex-row items-center gap-1">
				<div class="flex-grow text-3xl font-bold truncate">
					{project?.name ?? 'unknown'}
				</div>

				<button class="p-2 cursor-pointer" on:click={favouriteHandle}>
					<Star isFilled={$user_data?.favourites?.includes(project?.id)} />
				</button>
				<div
					class="text-sm px-2 py-1 rounded-full border border-[#2f2f2f]"
					style="background-color: {getColorFromString(project?.name)}"
				>
					{dayjs(project?.duedate).format('DD/MM/YYYY') ?? 'unknown'}
				</div>
			</div>
			<div class="flex-grow text-xs flex flex-col gap-1 mb-1">
				{#each project?.members ?? [] as member}
					<div>{member?.displayName ?? 'unknown'}</div>
				{/each}
			</div>
			<div class="w-full h-6">
				<ProgressBar value={progress} color={getColorFromString(project?.name)} hasWhiteBg />
			</div>
		</div>
		{#if show_warning}
			<div class="py-3 px-6 text-xs text-white flex flex-row items-center justify-between">
				<div class="w-5"><WarningIcon /></div>
				{#if day_diff < 0}
					<div>Project is {Math.abs(day_diff)} days overdue!</div>
				{:else}
					<div>Due date is in {day_diff} days!</div>
				{/if}
			</div>
		{/if}
	</button>
{/if}
