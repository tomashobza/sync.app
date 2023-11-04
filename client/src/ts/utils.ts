import toast from 'svelte-french-toast';

export const triggerMobileShare = async (
	title: string,
	text: string,
	url: string
): Promise<void> => {
	// Check if the Web Share API is available
	if (navigator.share) {
		try {
			// Attempt to share the content
			await navigator.share({
				title: title,
				text: text,
				url: url
			});
			toast.success('Content shared successfully!');
		} catch (error) {
			toast.error('Error sharing content:' + error);
		}
	} else {
		try {
			await navigator.clipboard.writeText(url);
			toast.success('Link copied to clipboard!');
		} catch (error) {
			toast.error('Error copying to clipboard: ' + error);
		}
	}
};
