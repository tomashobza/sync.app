<script>
	import Logo from '$lib/Logo.svelte';
	import Input from '$lib/Input.svelte';
	import EnvelopeIcon from '$lib/EnvelopeIcon.svelte';
	import Button from '$lib/Button.svelte';
	import LockIcon from '$lib/LockIcon.svelte';
</script>

<div class="w-full h-full flex flex-col items-center justify-center p-6 text-white">
	<div class="w-[10rem] mb-10">
		<Logo />
	</div>
	<div class="text-2xl font-bold">Project planner</div>
	<div class="flex flex-col gap-4 text-[#2f2f2f] my-8 w-full max-w-[18rem]">
		<Input placeholder="Email address">
			<div class="w-6">
				<EnvelopeIcon />
			</div>
		</Input>
		<Input placeholder="Password" type="password">
			<div class="w-6">
				<LockIcon />
			</div>
		</Input>
		<!-- <input type="email" placeholder="Email address:" />
			<input type="password" /> -->
	</div>
	<Button>Log in</Button>
</div>
