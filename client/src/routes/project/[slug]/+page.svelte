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

	// State variables to control various UI elements
	let show_links = false; // Controls the visibility of the links section
	let is_editing = false; // Indicates whether the project is in edit mode
	let was_changed = false; // Flags if any changes were made during editing

	// Variable to store the new due date when edited
	let new_duedate: Date;

	// Reactive statement to get the current project ID from the page URL
	$: projectId = $page.params.slug;

	// Reactive statement to find and set the current project from the projects store
	$: project = $projects.find((p) => p.id == projectId) as Project;

	// Reactive calculation of project progress based on completed tasks
	$: progress = project?.tasks?.filter((t) => t.done).length / project?.tasks?.length || 0;

	// Variable to store project title for display purposes
	let projectTitle: string;

	// Reactive block to fetch project title if the project object is not available
	$: if (!project) {
		getProjectTitle(projectId).then((v) => (projectTitle = v));
	}

	// Function to add a new link to the project
	const addLink = () => {
		// Prompt user to enter a link and check if it's empty
		const link = prompt('Enter a link to add to the project.', 'https://');
		if (!link) return; // Exit function if no link is entered

		// Add the new link to the project's links array
		project.links.push(link);

		// Update the project in the database with the new set of links
		updateProject(project.id, { links: project.links });
	};

	// Function to remove a specified link from the project
	const removeLink = (link: string) => {
		// Filter out the link to be removed from the project's links array
		project.links = project.links.filter((l) => l != link);

		// Update the project in the database with the modified set of links
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
					<!-- Container for project name and edit/save functionality -->

					<!-- Editable field for project name -->
					<div
						class="text-2xl font-bold flex-grow"
						contenteditable={is_editing}
						on:input={(e) => {
							project.name = e?.target?.textContent;
							was_changed = true;
						}}
					>
						{project?.name ?? 'unknown'}
						<!-- Display project name or 'unknown' if not set -->
					</div>

					<!-- Button to toggle editing mode and save changes -->
					<button
						on:click={() => {
							is_editing = !is_editing;
							if (!is_editing) {
								// If there was a change in the data, save it to the db
								if (!was_changed) return;
								project.duedate = new_duedate ? new Date(new_duedate) : project.duedate;
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
						<!-- Display edit button icon or text -->
					</button>

					<!-- Display for project due date -->
					<div class="relative px-2 py-1 rounded-full border border-[#2f2f2f] text-sm">
						{#if !is_editing}
							{dayjs(project?.duedate).format('DD/MM/YYYY') ?? 'unknown'}
							<!-- Show formatted due date or 'unknown' -->
						{:else}
							<!-- Editable input field for due date in editing mode -->
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
					<!-- Container for the progress bar -->
					<ProgressBar value={progress} color={'#fff'} />
					<!-- Progress bar showing the project's progress -->
				</div>
				<div class="flex flex-row items-center gap-2 transition-all mb-2">
					<!-- Container for project members and links toggle button -->

					<div class="flex flex-row items-center gap-2 flex-grow h-10">
						<!-- Flex container for displaying project members -->
						{#each project?.members ?? [] as member}
							<div class="w-10">
								<!-- User profile component for each project member -->
								<UsersProfile
									photoUrl={member?.photoURL}
									initials={member?.displayName[0]?.toUpperCase()}
								/>
							</div>
						{/each}
						{#if is_editing}
							<!-- Button to add new members, visible in editing mode -->
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
								<!-- Icon for adding new members -->
							</button>
						{/if}
					</div>
					<!-- Button to toggle the visibility of project links -->
					<button
						class="font-semibold flex flex-row items-center gap-1"
						on:click={() => {
							show_links = !show_links;
						}}
					>
						<div class="w-5 transition-all" class:rotate-180={show_links}>
							<ChevronDown />
							<!-- Chevron icon indicating collapsible nature -->
						</div>
						<div>Links</div>
						<!-- Text label 'Links' -->
					</button>
				</div>

				<!-- ADDING LINKS by Anastasia Butok (xbutok00) -->
				<!-- Conditional rendering based on the show_links state -->
				{#if show_links}
					<!-- Container for links with slide transition effect -->
					<div transition:slide|local class="flex flex-col items-stretch py-4">
						<!-- Check if there are any links in the project -->
						{#if project?.links?.length > 0}
							<!-- Container for displaying links in a flex row format -->
							<div class="flex flex-row flex-wrap gap-2 transition-all">
								<!-- Iterating over each link in the project -->
								{#each project?.links ?? [] as link (link)}
									<!-- Anchor tag for each link -->
									<a
										href={is_editing ? '#' : link}
										class:pointer-events-none={is_editing}
										target={is_editing ? '_self' : '_blank'}
										transition:scale
									>
										<!-- Button for each link with styling -->
										<button
											class="pointer-events-auto flex-shrink-0 rounded-full py-1 px-3 bg-white text-slate-600 underline underline-offset-1 max-w-[8rem] flex flex-row items-center transition-all"
											class:pl-2={is_editing}
											on:click={() => is_editing && removeLink(link)}
										>
											<!-- Show X icon to remove link in editing mode -->
											{#if is_editing}
												<div class="w-4 flex-shrink-0 mr-1">
													<XIcon />
												</div>
											{/if}
											<!-- Display the link text, truncated if too long -->
											<div class="flex-shrink whitespace-nowrap truncate">{link}</div>
										</button>
									</a>
								{/each}
							</div>
						{/if}

						<!-- Button to add a new link -->
						<button
							class="bg-white bg-opacity-30 rounded-full py-1 transition-all duration-100 active:scale-95 flex-shrink-0 grid place-content-center"
							class:mt-4={project?.links?.length > 0}
							on:click={addLink}
						>
							<PlusIcon />
							<!-- Icon for the add button -->
						</button>
					</div>
				{/if}

				<!-- ADDING LINKS by Nikita Koliada (xkolia00) -->
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
			<!-- Section heading for tasks -->
			<div class="text-xl px-6 text-white">Tasks:</div>

			<!-- Container for task cards with styling for overflow and spacing -->
			<div
				class="flex flex-row items-center p-6 pt-0 overflow-auto gap-6 h-[10rem] snap-mandatory snap-x"
			>
				<!-- Loop through each task in the project -->
				{#each project?.tasks ?? [] as task}
					<!-- Task card component for individual tasks -->
					<TaskCard
						disabled={is_editing}
						{project}
						{task}
						on:tick={() =>
							(progress = project?.tasks?.filter((t) => t.done).length / project?.tasks?.length)}
						on:click={() => is_editing && editing_task.set({ task, project })}
					/>
				{/each}
				<!-- Button to add a new task -->
				<button
					class="bg-white bg-opacity-30 rounded-xl text-white w-full flex-shrink-0 max-w-[15rem] h-full grid place-content-center border-2 border-transparent transition-all border-dashed active:border-white snap-center"
					on:click={() => {
						createTask(project?.id, { title: 'New task', done: false, assigned: '' });
						loadProjects();
					}}
				>
					<PlusIcon />
					<!-- Icon for adding a new task -->
				</button>
			</div>
		</div>
	</div>
{:else}
	<!-- Container for the project invitation or not-found message -->
	<div class="w-full h-full flex flex-col items-stretch justify-center gap-8">
		<!-- Conditional rendering based on whether projectTitle exists -->
		{#if projectTitle}
			<!-- Section displayed when there's an invitation to a project -->
			<div class="text-2xl text-white text-center">
				You've been<br /> invited to <!-- Invitation message -->
				<span class="font-bold">
					{projectTitle}
					<!-- Displaying the project title -->
				</span>
			</div>
			<!-- Buttons for accepting or declining the invitation -->
			<div class="flex flex-row items-center justify-center gap-2">
				<Button color="#8d32a3" on:click={() => addProjectMember(projectId)}>Accept</Button>
				<!-- Button to accept the invitation -->
				<Button on:click={() => goto('/')}>Decline</Button>
				<!-- Button to decline the invitation -->
			</div>
		{:else}
			<!-- Section displayed when the project is not found -->
			<div class="text-3xl font-bold text-white text-center">404</div>
			<!-- 404 error message -->
			<div class="text-xl text-white text-center">Project not found.</div>
			<!-- Message indicating the project was not found -->
			<!-- Button to return to the home page -->
			<div class="flex flex-row items-center justify-center gap-2">
				<Button on:click={() => goto('/')}>Go home</Button>
				<!-- Button to navigate back home -->
			</div>
		{/if}
	</div>
{/if}
