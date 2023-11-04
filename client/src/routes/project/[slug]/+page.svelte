<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Button.svelte';
	import ChevronDown from '$lib/ChevronDown.svelte';
	import ChevronLeft from '$lib/ChevronLeft.svelte';
	import EditButton from '$lib/EditButton.svelte';
	import PlusIcon from '$lib/PlusIcon.svelte';
	import ProgressBar from '$lib/ProgressBar.svelte';
	import UsersProfile from '$lib/UsersProfile.svelte';
	import { addProjectMember, getProjectTitle, removeMemberFromProject, saveProject } from '$ts/db';
	import type { Project } from '$ts/interfaces';
	import { projects, user_token } from '$ts/stores';
	import { triggerMobileShare } from '$ts/utils';
	import { error } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import toast from 'svelte-french-toast';
	import { fly, scale, slide } from 'svelte/transition';

	let show_links = false;
	let is_editing = false;
	let was_changed = false;

	$: projectId = $page.params.slug;
	$: project = $projects.find((p) => p.id == projectId) as Project;

	let projectTitle: string;

	$: if (!project) {
		getProjectTitle(projectId).then((v) => (projectTitle = v));
	}
</script>

{#if project}
	<div class="w-full h-full flex flex-col items-stretch gap-4">
		<div
			class="w-full bg-[#00000059] p-6 text-white flex flex-col"
			in:slide|local={{ duration: 400 }}
		>
			<div class="flex flex-row items-center gap-2">
				<div
					class="text-2xl font-bold flex-grow"
					contenteditable={is_editing}
					on:input={(e) => {
						project.name = e?.target?.textContent;
						was_changed = true;
					}}
				>
					{project?.name ?? 'unknown'}
				</div>
				<button
					on:click={() => {
						is_editing = !is_editing;
						if (!is_editing) {
							if (!was_changed) return;
							saveProject(project)
								.then(() => {
									toast.success('Project saved!');
									was_changed = false;
								})
								.catch(() => toast.error('Could not save project.'));
						}
					}}
				>
					<EditButton />
				</button>
				<div class="px-2 py-1 rounded-full border border-[#2f2f2f] text-sm">
					{dayjs(project?.duedate).format('DD/MM/YYYY') ?? 'unknown'}
				</div>
			</div>
			<div class="w-full h-6 text-black my-4 flex-shrink-0">
				<ProgressBar value={0.6} color={'#fff'} />
			</div>
			<div class="flex flex-row items-center gap-2 transition-all mb-2">
				<div class="flex flex-row items-center gap-2 flex-grow h-10">
					{#each project?.members ?? [] as member}
						<div class="w-10">
							<UsersProfile
								photoUrl={member?.photoURL}
								initials={member?.displayName[0]?.toUpperCase()}
							/>
						</div>
					{/each}
					{#if is_editing}
						<button
							class="grid place-content-center rounded-full w-10 aspect-square bg-white bg-opacity-30"
							transition:scale|local
							on:click={() =>
								triggerMobileShare(
									'Invite to project.',
									'Join my project!',
									$page?.url?.href ?? ''
								)}
						>
							<PlusIcon />
						</button>
					{/if}
				</div>
				<button
					class="font-semibold flex flex-row items-center gap-1"
					on:click={() => {
						show_links = !show_links;
					}}
				>
					<div class="w-5 transition-all" class:rotate-180={show_links}>
						<ChevronDown />
					</div>
					<div>Links</div>
				</button>
			</div>

			{#if show_links}
				<div transition:slide|local class="flex flex-col items-stretch py-4">
					{#if project?.links?.length > 0}
						<div class="flex flex-row flex-wrap gap-2 transition-all">
							{#each project?.links ?? [] as link}
								<a href={link} target="_blank">
									<div
										class="flex-shrink-0 rounded-full py-1 px-3 bg-white text-slate-600 underline underline-offset-1 max-w-[8rem] whitespace-nowrap truncate"
									>
										{link}
									</div>
								</a>
							{/each}
						</div>
					{/if}
					<!-- {#if is_editing} -->
					<button
						class="bg-white bg-opacity-30 rounded-full py-1 transition-all duration-100 active:scale-95 flex-shrink-0"
						class:mt-4={project?.links?.length > 0}>+</button
					>
					<!-- {/if} -->
				</div>
			{/if}

			{#if is_editing}
				<div transition:slide|local class="grid grid-cols-2 gap-2">
					<button
						class="bg-white bg-opacity-30 transition-all active:scale-95 grid place-content-center px-2 py-2 rounded-xl"
						on:click={() =>
							project?.id &&
							$user_token?.uid &&
							project?.members &&
							removeMemberFromProject(
								project?.id,
								$user_token?.uid,
								project?.members?.map((v) => v?.uid)
							)}>Leave project</button
					>
					<button
						class="bg-red-400 bg-opacity-50 transition-all active:scale-95 grid place-content-center px-2 py-2 rounded-xl"
						>Delete project</button
					>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="w-full h-full flex flex-col items-stretch justify-center gap-8">
		{#if projectTitle}
			<div class="text-2xl text-white text-center">
				You've been<br /> invited to
				<span class="font-bold">
					{projectTitle}
				</span>
			</div>
			<div class="flex flex-row items-center justify-center gap-2">
				<Button color="#8d32a3" on:click={() => addProjectMember(projectId)}>Accept</Button>
				<Button on:click={() => goto('/')}>Decline</Button>
			</div>
		{:else}
			<div class="text-3xl font-bold text-white text-center">404</div>
			<div class="text-xl text-white text-center">Project not found.</div>
			<div class="flex flex-row items-center justify-center gap-2">
				<Button on:click={() => goto('/')}>Go home</Button>
			</div>
		{/if}
	</div>
{/if}
