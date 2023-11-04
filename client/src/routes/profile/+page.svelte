<script lang="ts">
	import Button from '$lib/Button.svelte';
	import CameraIcon from '$lib/CameraIcon.svelte';
	import Input from '$lib/Input.svelte';
	import { updatePicture, updateUser } from '$ts/db';
	import { user_data } from '$ts/stores';
	import toast from 'svelte-french-toast';

	let profileURL: string;
	let username: string;
	let email: string;

	let image_updated = false;
	let name_updated = false;
	$: name_updated = username != $user_data?.displayName;
	// let email_updated = false;
	// $: email_updated = email != $user_data?.email;

	const handleSubmit = () => {
		if (image_updated) {
			updatePicture(file);
		}

		// if (name_updated && email_updated) {
		// 	updateUser({ displayName: username, email });
		// 	return;
		// }

		// if (email_updated) {
		// 	updateUser({ email });
		// 	return;
		// }

		if (name_updated) {
			updateUser({ displayName: username });
			return;
		}

		toast.success('Nothing to save!');
	};

	$: if ($user_data?.photoURL) {
		profileURL = $user_data?.photoURL;
	}

	$: if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			profileURL = e.target.result as string;
			image_updated = true;
		};
		reader.readAsDataURL(file);
	}

	user_data.subscribe((v) => v?.displayName && (username = v?.displayName));

	// $: if ($user_data?.email) {
	// 	email = $user_data?.email;
	// }

	let file: File;
</script>

<div class="flex flex-col items-center justify-center p-6 gap-8">
	<!-- <div class="text-2xl text-white">Edit your profile</div> -->

	<div
		class="w-[10rem] mt-10 bg-white aspect-square rounded-full overflow-hidden relative bg-center bg-cover bg-no-repeat"
		style="background-image: url('{profileURL ? profileURL : ''}');"
	>
		<!-- style="{profileURL ? `background-image: url('${profileURL}')` : ''})" -->
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
		<!-- <hr />
		<div class=" w-full max-w-[20rem] flex flex-row items-center gap-2">
			<div class="text-slate-400">Email:</div>
			<input
				type="text"
				placeholder="Type here..."
				value={email}
				class="px-2 py-2 bg-transparent flex-grow"
			/>
		</div> -->
	</div>

	<Button on:click={handleSubmit}>Submit</Button>
</div>
