<script lang="ts">
	import type { Project } from '$ts/interfaces';
	import dayjs from 'dayjs';
	import ProgressBar from './ProgressBar.svelte';

	const colors = ['#51E5FF', '#FDE74C', '#EC368D'];
	export let i = 0;

	export let project: Project;
</script>

<div
	class="w-full max-w-[22rem] p-6 bg-white rounded-3xl flex flex-col items-stretch gap-2 text-[#2F2F2F]"
>
	<div class="flex flex-row items-center">
		<div class="flex-grow text-3xl font-bold">
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
			<div>{member?.name ?? 'unknown'}</div>
		{/each}
	</div>
	<div class="w-full h-6">
		<ProgressBar value={0.6} color={colors[i % colors.length]} />
	</div>
</div>
