<!--
@component Register page
@author Anastasia Butok (xbutok00)
-->

<script lang="ts">
	// Importing necessary components and functions
	import Logo from '$lib/Logo.svelte';
	import Input from '$lib/Input.svelte';
	import EnvelopeIcon from '$lib/EnvelopeIcon.svelte';
	import Button from '$lib/Button.svelte';
	import LockIcon from '$lib/LockIcon.svelte';
	import { login, signin } from '$ts/login'; // Functions for login and sign-in
	import toast from 'svelte-french-toast'; // Toast notifications library
	import { last_route, user_token } from '$ts/stores'; // Svelte stores for navigation and user state
	import { goto } from '$app/navigation'; // Function for page navigation
	import ProfileIcon from '$lib/ProfileIcon.svelte'; // Icon component for profile

	// State variable to handle login/sign-in process
	let handlingLogin = false;

	// Function to handle sign-in process
	const handleSignin = () => {
		handlingLogin = true;
		toast
			.promise(signin(name, email, password), {
				loading: 'Signing in...', // Message during sign-in process
				success: 'Sign in successful!', // Message on successful sign-in
				error: 'Could not sign in.' // Message on sign-in failure
			})
			.then(() => (handlingLogin = false)); // Reset state after sign-in
	};

	// Reactive statement for navigation after sign-in
	$: if ($user_token && !handlingLogin) {
		goto($last_route?.includes('login') ? '/' : $last_route ?? '/');
	}

	// State variables for name, email, and password
	let name: string;
	let email: string;
	let password: string;
</script>

<!-- Main container for the sign-in page -->
<div class="w-full h-full flex flex-col items-center justify-center p-6 text-white">
	<!-- Welcome message and sign-in instruction -->
	<div class="font-bold text-2xl">Welcome! 👋</div>
	<div class="text-2xl font-bold">Create a new account:</div>

	<!-- Input fields for name, email, and password -->
	<div class="flex flex-col gap-4 mb-10 text-[#2f2f2f] my-8 w-full max-w-[18rem]">
		<Input placeholder="Name" bind:value={name}>
			<!-- Profile icon for the name input -->
			<div class="w-full">
				<ProfileIcon />
			</div>
		</Input>
		<Input placeholder="Email address" bind:value={email}>
			<!-- Envelope icon for the email input -->
			<EnvelopeIcon />
		</Input>
		<Input placeholder="Password" type="password" bind:value={password}>
			<!-- Lock icon for the password input -->
			<LockIcon />
		</Input>
	</div>

	<!-- Button to trigger sign-in process -->
	<Button on:click={handleSignin}>Sign in</Button>

	<!-- Button to navigate to the login page -->
	<button class="py-2 mt-4 underline underline-offset-2" on:click={() => goto('/login')}
		>Log in</button
	>
</div>
