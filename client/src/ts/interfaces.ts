import type { DocumentData, Timestamp } from 'firebase/firestore';

export interface Project {
	name: string;
	id: string;
	members: Member[];
	links: string[];
	duedate: Date;
}

export interface Member extends DocumentData {
	displayName: string;
	uid: string;
	email: string;
	photoURL: string;
	createdAt: Timestamp;
}
