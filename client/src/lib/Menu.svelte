<!--
@component Menu
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { quartInOut, sineIn } from 'svelte/easing';
	import { fly, slide } from 'svelte/transition';
	import XIcon from './XIcon.svelte';
	import ArrowRight from './ArrowRight.svelte';
	import { logout } from '../ts/login';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { user_data } from '$ts/stores';
	const dispatch = createEventDispatcher();

	/**
	 * Represents a menu component.
	 * @typedef {Object} Link
	 * @property {string} route - The route of the link.
	 * @property {string} name - The name of the link.
	 */

	/**
	 * An array of links.
	 * @type {Link[]}
	 */
	const links = [
		{
			route: '/',
			name: 'Show Projects'
		},
		{
			route: '/profile',
			name: 'Profile'
		}
	];

	let innerWidth = 0;

	/**
	 * Handles the logout action.
	 * Displays a toast message while logging out and dispatches the 'close' event when finished.
	 */
	const handleLogout = () => {
		toast
			.promise(logout(), {
				loading: 'Logging out...',
				success: 'Log out successful!',
				error: 'Could not log out.'
			})
			.finally(() => dispatch('close'));
	};
</script>

<svelte:window bind:innerWidth />

<div
	class="absolute inset-0 bg-[#34124E] flex flex-col gap-2 p-6 z-50"
	transition:fly={{ x: innerWidth, opacity: 1 }}
>
	<button class="mb-10 self-end w-5 text-white" on:click={() => dispatch('close')}>
		<XIcon />
		<!-- Close button -->
	</button>

	<div class="flex flex-col items-stretch flex-grow">
		{#each links as { route, name }, i}
			<button
				class="w-full py-6 text-white border-b border-white flex flex-row items-center gap-2 transition-all hover:scale-[.98]"
				class:border-t={i == 0}
				on:click={() => {
					goto(route); // Navigate to the specified route
					dispatch('close'); // Close the menu
				}}
			>
				<div class="flex-grow text-left">{name}</div>
				<!-- Link name -->
				<div class="w-5">
					<ArrowRight />
					<!-- Arrow icon -->
				</div>
			</button>
		{/each}
	</div>
	<div class="self-center flex flex-col items-center gap-4">
		<button
			class=" px-3 py-2 rounded-full border border-white text-sm text-white transition-all hover:text-[#34124E] hover:bg-white"
			on:click={handleLogout}>Log Out</button
		>
		<!-- Log Out button -->
		<div class="text-xs text-white">
			Logged in as: <span class="font-bold">{$user_data?.email ?? 'unknown'}</span>
			<!-- Logged-in user's email -->
		</div>
	</div>
</div>
