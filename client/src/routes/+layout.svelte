<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/Header.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { user_data, user_token } from '../ts/stores';
	import { page } from '$app/stores';
	import Menu from '$lib/Menu.svelte';
	import { auth } from '../ts/firebase';
	import '$ts/db';
	import { onAuthStateChanged } from 'firebase/auth';
	import toast, { Toaster } from 'svelte-french-toast';
	import DetailHeader from '$lib/DetailHeader.svelte';

	onMount(() => {
		onAuthStateChanged(auth, (user) => {
			// console.log(user);
			if (user) {
				user_token.set(user);
			} else {
				if (!$page?.route?.id?.includes('/login')) goto('/login');
			}
		});
		// user_token.subscribe((v) => {
		// 	!v && goto('/login');
		// });
	});

	$: container_scroll = 0;
	$: show_menu = !($page?.route?.id == '/login' || $page?.route?.id?.includes('/project/'));

	let showMenu = false;
</script>

<Toaster />

<div class="wrapper min-w-[20rem]">
	{#if show_menu}
		<div class="absolute top-0 left-0 w-full">
			<Header scroll={container_scroll} on:click={() => (showMenu = true)} />
		</div>
	{:else}
		<div class="absolute top-0 left-0 w-full">
			<DetailHeader scroll={container_scroll} on:click={() => (showMenu = true)} />
		</div>
	{/if}
	<div
		class="w-full flex-grow overflow-auto pt-16"
		on:scroll={(e) => e?.target?.scrollTop && (container_scroll = e.target.scrollTop)}
	>
		<slot />
	</div>

	{#if showMenu}
		<Menu on:close={() => (showMenu = false)} />
	{/if}
</div>

<style lang="postcss">
	.wrapper {
		@apply relative;
		@apply w-full h-full;
		@apply flex flex-col items-center;
	}
</style>
