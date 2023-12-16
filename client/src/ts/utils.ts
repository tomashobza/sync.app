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

export const getColorFromString = (input: string): string => {
	// Define the colors array
	const colors = ['#51E5FF', '#FDE74C', '#EC368D'];

	// Simple hash function to convert string to a number
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	// Use the absolute value of the hash modulo the number of colors to choose a color
	const index = Math.abs(hash) % colors.length;
	return colors[index];
};
