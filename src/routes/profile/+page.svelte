<script>
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import ProfilePic from '$lib/ProfilePic.svelte';
</script>

<div class="w-full h-full flex flex-col items-center justify-center p-6 text-white">
	<div class="w-[10rem] mb-10">
		<ProfilePic />
	</div>
	<div class="flex flex-col gap-4 text-[#2f2f2f] my-8 w-full max-w-[18rem]">
		<Input placeholder="Name" />
	</div>

	<Button>Next</Button>
</div>
