import type { DocumentData, Timestamp } from 'firebase/firestore';

export interface Project {
	name: string;
	id: string;
	members: Member[];
	links: string[];
	duedate: Date;
	tasks: Task[];
}

export interface Task {
	id: string;
	title: string;
	assigned: string;
	done: boolean;
}

export interface Member extends DocumentData {
	displayName: string;
	uid: string;
	email: string;
	photoURL: string;
	createdAt: Timestamp;
}
