import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

export const user_token = writable<User | null>(null);

export const user_data = writable<{
	name: string;
	id: string;
	email: string;
} | null>();

user_token.subscribe((value) => {
	user_data.set({
		name: value?.displayName || 'unknown',
		id: value?.uid || '0',
		email: value?.email || ''
	});
});
