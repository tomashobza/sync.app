<!--
@component Project detail page
@author Nikita Koliada (xkolia00) [& Anastasia Butok (xbutok00)]
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Button.svelte';
	import ChevronDown from '$lib/ChevronDown.svelte';
	import ChevronLeft from '$lib/ChevronLeft.svelte';
	import EditButton from '$lib/EditButton.svelte';
	import PlusIcon from '$lib/PlusIcon.svelte';
	import ProgressBar from '$lib/ProgressBar.svelte';
	import TaskCard from '$lib/TaskCard.svelte';
	import Tick from '$lib/Tick.svelte';
	import UsersProfile from '$lib/UsersProfile.svelte';
	import XIcon from '$lib/XIcon.svelte';
	import {
		addProjectMember,
		createTask,
		deleteProject,
		getProjectTitle,
		loadProjects,
		removeMemberFromProject,
		saveProject,
		updateProject,
		updateTask
	} from '$ts/db';
	import type { Project } from '$ts/interfaces';
	import { editing_task, projects, user_token } from '$ts/stores';
	import { triggerMobileShare } from '$ts/utils';
	import dayjs from 'dayjs';
	import { Timestamp } from 'firebase/firestore';
	import toast from 'svelte-french-toast';
	import { fly, scale, slide } from 'svelte/transition';

	let show_links = false;
	let is_editing = false;
	let was_changed = false;

	let new_duedate: Date;

	$: projectId = $page.params.slug;
	$: project = $projects.find((p) => p.id == projectId) as Project;

	$: progress = project?.tasks?.filter((t) => t.done).length / project?.tasks?.length || 0;

	let projectTitle: string;

	$: if (!project) {
		getProjectTitle(projectId).then((v) => (projectTitle = v));
	}

	const addLink = () => {
		const link = prompt('Enter a link to add to the project.', 'https://');
		if (!link) return;

		project.links.push(link);
		updateProject(project.id, { links: project.links });
	};

	const removeLink = (link: string) => {
		project.links = project.links.filter((l) => l != link);
		updateProject(project.id, { links: project.links });
	};
</script>

{#if project}
	<div class="w-full h-full flex flex-col items-center gap-2">
		<div class="w-full h-full md:max-w-[40rem] self-center flex flex-col items-stretch gap-4">
			<div
				class="w-full md:rounded-xl bg-[#00000059] p-6 text-white flex flex-col transition-all"
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
								project.duedate = new Date(new_duedate);
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
					<div class="relative px-2 py-1 rounded-full border border-[#2f2f2f] text-sm">
						{#if !is_editing}
							{dayjs(project?.duedate).format('DD/MM/YYYY') ?? 'unknown'}
						{:else}
							<input
								type="date"
								class="bg-transparent"
								value={project?.duedate?.toISOString().split('T')[0] ?? ''}
								on:input={(e) => {
									new_duedate = e?.target?.value;
									was_changed = true;
								}}
							/>
						{/if}
					</div>
				</div>
				<div class="w-full h-6 text-black my-4 flex-shrink-0">
					<ProgressBar value={progress} color={'#fff'} />
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
				<!-- ADDING LINKS by Anastasia Butok (xbutok00) -->
				{#if show_links}
					<div transition:slide|local class="flex flex-col items-stretch py-4">
						{#if project?.links?.length > 0}
							<div class="flex flex-row flex-wrap gap-2 transition-all">
								{#each project?.links ?? [] as link (link)}
									<a
										href={is_editing ? '#' : link}
										class:pointer-events-none={is_editing}
										target={is_editing ? '_self' : '_blank'}
										transition:scale
									>
										<button
											class=" pointer-events-auto flex-shrink-0 rounded-full py-1 px-3 bg-white text-slate-600 underline underline-offset-1 max-w-[8rem] flex flex-row items-center transition-all"
											class:pl-2={is_editing}
											on:click={() => is_editing && removeLink(link)}
										>
											{#if is_editing}
												<div class="w-4 flex-shrink-0 mr-1">
													<XIcon />
												</div>
											{/if}
											<div class="flex-shrink whitespace-nowrap truncate">{link}</div>
										</button>
									</a>
								{/each}
							</div>
						{/if}
						<button
							class="bg-white bg-opacity-30 rounded-full py-1 transition-all duration-100 active:scale-95 flex-shrink-0 grid place-content-center"
							class:mt-4={project?.links?.length > 0}
							on:click={addLink}
						>
							<PlusIcon /></button
						>
					</div>
				{/if}
				<!-- ADDING LINKS by Anastasia Butok (xbutok00) -->
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
							on:click={() => deleteProject(project?.id)}>Delete project</button
						>
					</div>
				{/if}
			</div>
			<div class="text-xl px-6 text-white">Tasks:</div>
			<div
				class="flex flex-row items-center p-6 pt-0 overflow-auto gap-6 h-[10rem] snap-mandatory snap-x"
			>
				{#each project?.tasks ?? [] as task}
					<TaskCard
						disabled={is_editing}
						{project}
						{task}
						on:tick={() =>
							(progress = project?.tasks?.filter((t) => t.done).length / project?.tasks?.length)}
						on:click={() => is_editing && editing_task.set({ task, project })}
					/>
				{/each}
				<button
					class="bg-white bg-opacity-30 rounded-xl text-white w-full flex-shrink-0 max-w-[15rem] h-full grid place-content-center border-2 border-transparent transition-all border-dashed active:border-white snap-center"
					on:click={() => {
						createTask(project?.id, { title: 'New task', done: false, assigned: '' });
						loadProjects();
					}}
				>
					<PlusIcon />
				</button>
			</div>
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
