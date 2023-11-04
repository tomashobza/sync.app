<script lang="ts">
	import type { Project } from '$ts/interfaces';
	import dayjs from 'dayjs';
	import ProgressBar from './ProgressBar.svelte';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import WarningIcon from './WarningIcon.svelte';
	import { goto } from '$app/navigation';

	const colors = ['#51E5FF', '#FDE74C', '#EC368D'];
	export let i = 0;

	export let project: Project;

	$: day_diff = dayjs(project?.duedate).diff(dayjs(), 'day');
	$: show_warning = day_diff < 7;

	let showCard = false;
	onMount(() => (showCard = true));
</script>

{#if showCard}
	<button
		class="bg-[#ffffff33] w-full max-w-[22rem] rounded-3xl text-left transition-all hover:scale-[.98] flex flex-col items-stretch"
		in:scale={{ delay: i * 50 }}
		on:click={() => goto(`/project/${project?.id}`)}
	>
		<div
			class="w-full p-6 bg-white rounded-3xl flex flex-col items-stretch gap-2 text-[#2F2F2F] card flex-grow"
		>
			<div class="flex flex-row items-center gap-1">
				<div class="flex-grow text-3xl font-bold truncate">
					{project?.name ?? 'unknown'}
				</div>
				<div
					class="text-sm px-2 py-1 rounded-full border border-[#2f2f2f]"
					style="background-color: {colors[i % colors.length]}"
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
				<ProgressBar value={0.6} color={colors[i % colors.length]} />
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
