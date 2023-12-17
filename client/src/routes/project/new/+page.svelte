<!--
@component New project page
@author Anastasia Butok (xbutok00)
-->

<script lang="ts">
	// Importing the Button component from a library
	import Button from '$lib/Button.svelte';

	// Importing a function to create a new project in the database
	import { createProject } from '$ts/db';

	// Importing a toast notification library for user feedback
	import toast from 'svelte-french-toast';

	// Importing Timestamp from Firebase for handling date and time
	import { Timestamp } from 'firebase/firestore';

	// Importing 'goto' for navigation
	import { goto } from '$app/navigation';

	// Importing the scale transition from Svelte for animations
	import { scale } from 'svelte/transition';

	// Importing Svelte's store functionality
	import { get } from 'svelte/store';

	// Importing a user token store
	import { user_token } from '$ts/stores';

	// Declaring variables to store project name and due date
	let name: string;
	let duedate: Date;

	// Function to handle the creation of a new project
	const createHandle = () => {
		toast
			.promise(
				createProject({
					name,
					duedate: Timestamp.fromDate(new Date(duedate)),
					members: (get(user_token)?.uid ? [get(user_token)?.uid] : []) as string[]
				}),
				{
					loading: 'Creating project...',
					success: 'Project created!',
					error: 'Could not create project.'
				}
			)
			// Navigating to the home page upon successful project creation
			.then(() => goto('/'));
	};
</script>

<div class="w-full h-full flex flex-col items-stretch justify-center gap-10 px-6">
	// Animated title for the new project page
	<div in:scale class="text-2xl text-white drop-shadow self-center">Make a project</div>

	// Form section for entering project details
	<div in:scale class="rounded-xl bg-white p-4 flex flex-col gap-4 items-stretch">
		// Input field for the project name
		<div class="flex flex-row items-center h-8 gap-2">
			<div class="text-slate-500">Name:</div>
			<input bind:value={name} type="text" class="h-full flex-grow" placeholder="Type here..." />
		</div>
		<hr />
		// Input field for the project due date
		<div class="flex flex-row items-center h-8 gap-2">
			<div class="text-slate-500">Due date:</div>
			<input bind:value={duedate} type="date" class="h-full flex-grow" placeholder="Type here..." />
		</div>
	</div>

	// Button to trigger project creation
	<div class="w-full flex flex-col items-stretch justify-stretch" in:scale>
		<Button on:click={createHandle}>Create</Button>
	</div>
</div>
