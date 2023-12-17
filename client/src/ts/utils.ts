/**
 * @module utils
 * @description
 * Provides utility functions for the app.
 * @author Tomáš Hobza (xhobza03)
 */

import toast from 'svelte-french-toast';

/**
 * Triggers mobile share functionality using the Web Share API if available,
 * otherwise copies the URL to the clipboard.
 * @param title - The title of the content to be shared.
 * @param text - The text content to be shared.
 * @param url - The URL of the content to be shared.
 * @returns A promise that resolves when the sharing or copying is complete.
 */
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

/**
 * Returns a color from an input string.
 * @param input - The input string.
 * @returns The color as a string.
 */
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
