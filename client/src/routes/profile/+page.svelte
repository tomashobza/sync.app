<!--
@component Profile page
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	// Importing necessary components and functions
	import Button from '$lib/Button.svelte';
	import CameraIcon from '$lib/CameraIcon.svelte';
	import Input from '$lib/Input.svelte';
	import { updatePicture, updateUser } from '$ts/db';
	import { user_data } from '$ts/stores';
	import toast from 'svelte-french-toast';

	// Declaring variables for profile picture, username, and email
	let profileURL: string;
	let username: string;
	let email: string;

	// Tracking if the profile picture and username have been updated
	let image_updated = false;
	let name_updated = false;

	// Checking if the username has been updated
	$: name_updated = username != $user_data?.displayName;

	// Handling form submission
	const handleSubmit = () => {
		if (image_updated) {
			updatePicture(file);
		}

		if (name_updated) {
			updateUser({ displayName: username });
			return;
		}

		toast.success('Nothing to save!');
	};

	// Updating the profile picture URL when it is available
	$: if ($user_data?.photoURL) {
		profileURL = $user_data?.photoURL;
	}

	// Updating the profile picture URL when a new file is selected
	$: if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			profileURL = e.target.result as string;
			image_updated = true;
		};
		reader.readAsDataURL(file);
	}

	// Subscribing to the user_data store to get the current username
	user_data.subscribe((v) => v?.displayName && (username = v?.displayName));

	// Declaring the file variable for storing the selected profile picture file
	let file: File;
</script>

<!-- Rendering the profile page -->
<div class="flex flex-col items-center justify-center p-6 gap-8">
	<!-- Profile picture section -->
	<div
		class="w-[10rem] mt-10 bg-white aspect-square rounded-full overflow-hidden relative bg-center bg-cover bg-no-repeat"
		style="background-image: url('{profileURL ? profileURL : ''}');"
	>
		<div
			class="absolute pointer-events-none inset-0 bg-black bg-opacity-40 grid place-content-center text-white"
		>
			<div class="w-[4rem] drop-shadow-md">
				<CameraIcon />
			</div>
		</div>
		<input
			on:change={(e) => {
				file = e?.target?.files[0];
			}}
			type="file"
			accept="image/*"
			class="z-10 absolute inset-0 w-full h-full opacity-0"
		/>
	</div>

	<!-- Username input section -->
	<div class="rounded-3xl bg-white flex flex-col gap-2 py-3 px-5">
		<div class=" w-full max-w-[20rem] flex flex-row items-center gap-2">
			<div class="text-slate-400">Name:</div>
			<input
				type="text"
				placeholder="Type here..."
				bind:value={username}
				class="px-2 py-2 bg-transparent flex-grow"
			/>
		</div>
	</div>

	<!-- Submit button -->
	<Button on:click={handleSubmit}>Submit</Button>
</div>
