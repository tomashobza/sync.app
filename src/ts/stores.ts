import { writable } from "svelte/store";


export const user_data = writable<{
    name: string;
    id: string;
    email: string;
} | null>(null);

