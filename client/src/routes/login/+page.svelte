<!--
@component Login page
@author Anastasia Butok (xbutok00)
-->

<script lang="ts">
	// Importing components and functionalities
	import Logo from '$lib/Logo.svelte';
	import Input from '$lib/Input.svelte';
	import EnvelopeIcon from '$lib/EnvelopeIcon.svelte';
	import Button from '$lib/Button.svelte';
	import LockIcon from '$lib/LockIcon.svelte';
	import { login } from '$ts/login'; // Function for handling login
	import toast from 'svelte-french-toast'; // Library for displaying toast notifications
	import { last_route, user_token } from '$ts/stores'; // Svelte stores
	import { goto } from '$app/navigation'; // Navigation function

	// State for handling login process
	let handlingLogin = false;

	// Function to handle login process
	const handleLogin = () => {
		handlingLogin = true;
		toast
			.promise(login(email, password), {
				loading: 'Logging in...', // Message during login process
				success: 'Log in successful!', // Message on successful login
				error: 'Could not log in.' // Message on login failure
			})
			.then(() => (handlingLogin = false)); // Reset state after login
	};

	// Reactive statement to navigate user based on token and last route
	$: if ($user_token && !handlingLogin) {
		goto($last_route?.includes('login') ? '/' : $last_route ?? '/');
	}

	// State variables for email and password
	let email: string;
	let password: string;
</script>

<!-- Main container for the login page -->
<div class="w-full h-full flex flex-col items-center justify-center p-6 text-white">
	<!-- Logo display -->
	<div class="w-[10rem] mb-10">
		<Logo />
	</div>
	<!-- Page title -->
	<div class="text-2xl font-bold">Project planner</div>
	<!-- Input fields for email and password -->
	<div class="flex flex-col gap-4 text-[#2f2f2f] my-8 w-full max-w-[18rem]">
		<!-- Email input field with bound value and icon -->
		<Input placeholder="Email address" bind:value={email}>
			<EnvelopeIcon />
		</Input>
		<!-- Password input field with bound value and icon -->
		<Input placeholder="Password" type="password" bind:value={password}>
			<LockIcon />
		</Input>
	</div>
	<!-- Login button -->
	<Button on:click={handleLogin}>Log in</Button>
	<!-- Button to navigate to account creation -->
	<button class="py-2 mt-4 underline underline-offset-2" on:click={() => goto('/login/new')}
		>Create an account</button
	>
</div>
