import { writable } from "svelte/store";


export const user_data = writable<{
    name: string;
    id: string;
    email: string;
} | null>({
    name: "Anastasia Butok",
    id: "0",
    email: "xbutok00@vutbr.cz",
});
