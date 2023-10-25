import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import type { Member, Project } from './interfaces';

export const user_token = writable<User | null>(null);
export const user_data = writable<Member | null>();

user_token.subscribe((value) => {
	user_data.set({
		name: value?.displayName || 'unknown',
		id: value?.uid || '0',
		email: value?.email || ''
	});
});

export const projects = writable<Project[]>([
	{
		name: 'ITU',
		members: [
			{
				name: 'John Doe',
				id: '1',
				email: ''
			}
		],
		id: '1',
		duedate: new Date()
	},
	{
		name: 'Project X',
		members: [
			{
				name: 'Jane Doe',
				id: '2',
				email: ''
			},
			{
				name: 'Bob Smith',
				id: '3',
				email: ''
			}
		],
		id: '2',
		duedate: new Date('2022-01-01')
	},
	{
		name: 'Project Y',
		members: [
			{
				name: 'Alice Smith',
				id: '4',
				email: ''
			},
			{
				name: 'Charlie Brown',
				id: '5',
				email: ''
			}
		],
		id: '3',
		duedate: new Date('2022-02-01')
	},
	{
		name: 'Project Z',
		members: [
			{
				name: 'Eve Johnson',
				id: '6',
				email: ''
			},
			{
				name: 'David Lee',
				id: '7',
				email: ''
			}
		],
		id: '4',
		duedate: new Date('2022-03-01')
	},
	{
		name: 'Project A',
		members: [
			{
				name: 'Frank Williams',
				id: '8',
				email: ''
			},
			{
				name: 'Grace Davis',
				id: '9',
				email: ''
			}
		],
		id: '5',
		duedate: new Date('2022-04-01')
	},
	{
		name: 'Project B',
		members: [
			{
				name: 'Henry Lee',
				id: '10',
				email: ''
			},
			{
				name: 'Isabella Brown',
				id: '11',
				email: ''
			}
		],
		id: '6',
		duedate: new Date('2022-05-01')
	},
	{
		name: 'Project C',
		members: [
			{
				name: 'Jack Johnson',
				id: '12',
				email: ''
			},
			{
				name: 'Katie Smith',
				id: '13',
				email: ''
			}
		],
		id: '7',
		duedate: new Date('2022-06-01')
	},
	{
		name: 'Project D',
		members: [
			{
				name: 'Liam Davis',
				id: '14',
				email: ''
			},
			{
				name: 'Mia Wilson',
				id: '15',
				email: ''
			}
		],
		id: '8',
		duedate: new Date('2022-07-01')
	}
]);
