<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { quartInOut, sineIn } from 'svelte/easing';
	import { fly, slide } from 'svelte/transition';
	import XIcon from './XIcon.svelte';
	import ArrowRight from './ArrowRight.svelte';
	import { logout } from '../ts/login';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	const dispatch = createEventDispatcher();

	const links: {
		route: string;
		name: string;
	}[] = [
		{
			route: '/',
			name: 'Show Projects'
		},
		{
			route: '/profile',
			name: 'Profile'
		}
	];

	let innerWidth: number = 0;

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
	class="absolute inset-0 bg-[#34124E] flex flex-col gap-2 p-6"
	transition:fly={{ x: innerWidth, opacity: 1 }}
>
	<button class="mb-10 self-end w-5 text-white" on:click={() => dispatch('close')}>
		<XIcon />
	</button>

	<div class="flex flex-col items-stretch flex-grow">
		{#each links as { route, name }, i}
			<button
				class="w-full py-6 text-white border-b border-white flex flex-row items-center gap-2 transition-all hover:scale-[.98]"
				class:border-t={i == 0}
				on:click={() => {
					goto(route);
					dispatch('close');
				}}
			>
				<div class="flex-grow text-left">{name}</div>
				<div class="w-5">
					<ArrowRight />
				</div>
			</button>
		{/each}
	</div>
	<button
		class="self-center px-3 py-2 rounded-full border border-white text-sm text-white transition-all hover:text-[#34124E] hover:bg-white"
		on:click={handleLogout}>Log Out</button
	>
</div>
