<!--
@component Main layout
@author Tomáš Hobza (xhobza03)
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/Header.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { editing_task, last_route, user_data, user_token } from '../ts/stores';
	import { page } from '$app/stores';
	import Menu from '$lib/Menu.svelte';
	import { auth } from '../ts/firebase';
	import '$ts/db';
	import { onAuthStateChanged } from 'firebase/auth';
	import toast, { Toaster } from 'svelte-french-toast';
	import DetailHeader from '$lib/DetailHeader.svelte';
	import EditTaskModal from '$lib/EditTaskModal.svelte';

	// get the user auth token and store it in the store on mount
	onMount(() => {
		last_route.set($page?.url?.pathname);

		// listen for auth state changes
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// if the user is logged in, store the user data in the store
				user_token.set(user);
			} else {
				// if the user is not logged in and the page is not login, redirect to login
				if (!$page?.route?.id?.includes('/login')) goto('/login');
			}
		});
	});

	// reactive statement to store the scroll position of the container
	$: container_scroll = 0;

	// reactive statement to show menu only on pages that are not login or project
	$: show_menu = !($page?.route?.id?.includes('/login') || $page?.route?.id?.includes('/project/'));

	let showMenu = false;
</script>

<svelte:head>
	<title>Sync</title>
</svelte:head>

<Toaster />

<!-- if the user is logged in and the page is not login, show the edit task modal -->
{#if $editing_task}
	<EditTaskModal />
{/if}

<div class="wrapper min-w-[20rem]">
	{#if show_menu}
		<!-- Menu component that is shown when the menu button is clicked -->
		<div class="absolute top-0 left-0 w-full">
			<Header scroll={container_scroll} on:click={() => (showMenu = true)} />
		</div>
	{:else if !$page?.route?.id?.includes('/login')}
		<!-- DetailHeader component that is shown on all pages except login -->
		<div class="absolute top-0 left-0 w-full">
			<DetailHeader scroll={container_scroll} on:click={() => (showMenu = true)} />
		</div>
	{/if}
	<!-- Main container for the page content -->
	<div
		class="w-full flex-grow overflow-auto pt-16"
		on:scroll={(e) => e?.target?.scrollTop && (container_scroll = e.target.scrollTop)}
	>
		<slot />
	</div>

	<!-- Menu component that is shown when the menu button is clicked -->
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
