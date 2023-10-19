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
			<EnvelopeIcon />
		</Input>
		<Input placeholder="Password" type="password">
			<LockIcon />
		</Input>
		<!-- <input type="email" placeholder="Email address:" />
			<input type="password" /> -->
	</div>
	<Button>Log in</Button>
</div>

<style lang="postcss">
	.kontik {
		background: linear-gradient(
				203deg,
				#8d32a3 9.16%,
				#629ef8 53.83%,
				#34124e 92.09%,
				#5c369a 113.92%
			),
			url('perlinnoise.png'), lightgray 0% / cover no-repeat;
		background-blend-mode: hard-light, normal;
	}
</style>
