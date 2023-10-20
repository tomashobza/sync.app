<script>
	import CameraIcon from './CameraIcon.svelte';

	export let iseditable = false;

	function addpicture() {
		var input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.click();
	}
</script>

<div
	on:click={addpicture}
	class="w-full aspect-square rounded-full overflow-hidden grid place-content-center relative"
>
	<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div class="w-8">
			<CameraIcon />
		</div>
	</div>

	<img src="https://picsum.photos/seed/1/200" alt="Profile" class="w-full" />
</div>
