<script lang="ts">
	import Logo from '$lib/Logo.svelte';
	import Input from '$lib/Input.svelte';
	import EnvelopeIcon from '$lib/EnvelopeIcon.svelte';
	import Button from '$lib/Button.svelte';
	import LockIcon from '$lib/LockIcon.svelte';
	import { login } from '$ts/login';
	import toast from 'svelte-french-toast';
	import { user_token } from '$ts/stores';
	import { goto } from '$app/navigation';

	let handlingLogin = false;

	const handleLogin = () => {
		handlingLogin = true;
		toast.promise(login(email, password), {
			loading: 'Logging in...',
			success: 'Log in successful!',
			error: 'Could not log in.'
		});
	};

	$: if ($user_token && !handlingLogin) {
		toast.success('Log in successful!');
		goto('/');
	}

	let email: string;
	let password: string;
</script>

<div class="w-full h-full flex flex-col items-center justify-center p-6 text-white">
	<div class="w-[10rem] mb-10">
		<Logo />
	</div>
	<div class="text-2xl font-bold">Project planner</div>
	<div class="flex flex-col gap-4 text-[#2f2f2f] my-8 w-full max-w-[18rem]">
		<Input placeholder="Email address" bind:value={email}>
			<EnvelopeIcon />
		</Input>
		<Input placeholder="Password" type="password" bind:value={password}>
			<LockIcon />
		</Input>
		<!-- <input type="email" placeholder="Email address:" />
			<input type="password" /> -->
	</div>
	<Button on:click={handleLogin}>Log in</Button>
	<button class="py-2 mt-4 underline underline-offset-2" on:click={() => goto('/login/new')}
		>Create an account</button
	>
</div>
