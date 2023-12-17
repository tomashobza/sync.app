import type { DocumentData, Timestamp } from 'firebase/firestore';

/**
 * Represents a project.
 */
export interface Project {
	name: string;
	id: string;
	members: Member[];
	links: string[];
	duedate: Date;
	tasks: Task[];
}

/**
 * Represents a task.
 */
export interface Task {
	id: string;
	title: string;
	assigned: string;
	done: boolean;
}

/**
 * Represents a member with their information.
 */
export interface Member extends DocumentData {
	displayName: string;
	uid: string;
	email: string;
	photoURL: string;
	favourites: string[];
}
