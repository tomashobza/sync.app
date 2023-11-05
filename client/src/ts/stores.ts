import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import type { Member, Project, Task } from './interfaces';

export const user_token = writable<User | null>(null);
export const user_data = writable<Member | null>();

export const projects = writable<Project[]>([]);

export const last_route = writable<string | null>(null);

export const editing_task = writable<null | { task: Task; project: Project }>(null);
