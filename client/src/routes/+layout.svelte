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

	onMount(() => {
		last_route.set($page?.url?.pathname);

		onAuthStateChanged(auth, (user) => {
			if (user) {
				user_token.set(user);
			} else {
				if (!$page?.route?.id?.includes('/login')) goto('/login');
			}
		});
	});

	$: container_scroll = 0;
	$: show_menu = !($page?.route?.id?.includes('/login') || $page?.route?.id?.includes('/project/'));

	let showMenu = false;
</script>

<svelte:head>
	<title>Sync</title>
</svelte:head>

<Toaster />

{#if $editing_task}
	<EditTaskModal />
{/if}

<div class="wrapper min-w-[20rem]">
	{#if show_menu}
		<div class="absolute top-0 left-0 w-full">
			<Header scroll={container_scroll} on:click={() => (showMenu = true)} />
		</div>
	{:else if !$page?.route?.id?.includes('/login')}
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
