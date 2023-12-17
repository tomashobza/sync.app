<!--
@component Register page
@author Anastasia Butok (xbutok00)
-->

<script lang="ts">
	import Logo from '$lib/Logo.svelte';
	import Input from '$lib/Input.svelte';
	import EnvelopeIcon from '$lib/EnvelopeIcon.svelte';
	import Button from '$lib/Button.svelte';
	import LockIcon from '$lib/LockIcon.svelte';
	import { login, signin } from '$ts/login';
	import toast from 'svelte-french-toast';
	import { last_route, user_token } from '$ts/stores';
	import { goto } from '$app/navigation';
	import ProfileIcon from '$lib/ProfileIcon.svelte';

	let handlingLogin = false;

	const handleSignin = () => {
		handlingLogin = true;
		toast
			.promise(signin(name, email, password), {
				loading: 'Signing in...',
				success: 'Sign in successful!',
				error: 'Could not sign in.'
			})
			.then(() => (handlingLogin = false));
	};

	$: if ($user_token && !handlingLogin) {
		goto($last_route?.includes('login') ? '/' : $last_route ?? '/');
	}

	let name: string;
	let email: string;
	let password: string;
</script>

<div class="w-full h-full flex flex-col items-center justify-center p-6 text-white">
	<div class="font-bold text-2xl">Welcome! 👋</div>
	<div class="text-2xl font-bold">Create a new account:</div>
	<div class="flex flex-col gap-4 mb-10 text-[#2f2f2f] my-8 w-full max-w-[18rem]">
		<Input placeholder="Name" bind:value={name}>
			<div class="w-full">
				<ProfileIcon />
			</div>
		</Input>
		<Input placeholder="Email address" bind:value={email}>
			<EnvelopeIcon />
		</Input>
		<Input placeholder="Password" type="password" bind:value={password}>
			<LockIcon />
		</Input>
		<!-- <input type="email" placeholder="Email address:" />
			<input type="password" /> -->
	</div>
	<Button on:click={handleSignin}>Sign in</Button>
	<button class="py-2 mt-4 underline underline-offset-2" on:click={() => goto('/login')}
		>Log in</button
	>
</div>
