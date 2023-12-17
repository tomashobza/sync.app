<!--
@component New project page
@author Anastasia Butok (xbutok00)
-->

<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { createProject } from '$ts/db';
	import toast from 'svelte-french-toast';
	import { Timestamp } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	import { get } from 'svelte/store';
	import { user_token } from '$ts/stores';

	let name: string;
	let duedate: Date;

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
			.then(() => goto('/'));
	};
</script>

<div class="w-full h-full flex flex-col items-stretch justify-center gap-10 px-6">
	<div in:scale class="text-2xl text-white drop-shadow self-center">Make a project</div>
	<div in:scale class="rounded-xl bg-white p-4 flex flex-col gap-4 items-stretch">
		<div class="flex flex-row items-center h-8 gap-2">
			<div class="text-slate-500">Name:</div>
			<input bind:value={name} type="text" class="h-full flex-grow" placeholder="Type here..." />
		</div>
		<hr />
		<div class="flex flex-row items-center h-8 gap-2">
			<div class="text-slate-500">Due date:</div>
			<input bind:value={duedate} type="date" class="h-full flex-grow" placeholder="Type here..." />
		</div>
	</div>
	<div class="w-full flex flex-col items-stretch justify-stretch" in:scale>
		<Button on:click={createHandle}>Create</Button>
	</div>
</div>
