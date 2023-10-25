export interface Project {
	name: string;
	id: string;
	members: Member[];
	duedate: Date;
}

export interface Member {
	name: string;
	id: string;
	email: string;
}
