import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import type { Member, Project } from './interfaces';

export const user_token = writable<User | null>(null);
export const user_data = writable<Member | null>();

user_token.subscribe((value) => {
	console.log('user_token', value);
});

export const projects = writable<Project[]>([]);

export const last_route = writable<string | null>(null);

//! DEV
// projects.set([
// 	{
// 		name: 'ITU',
// 		members: ['t0Nc8M2apHWCV8SuucSFI4yhMq42'],
// 		id: '1',
// 		duedate: new Date()
// 	},
// 	{
// 		name: 'Project X',
// 		members: ['t0Nc8M2apHWCV8SuucSFI4yhMq42', 'Z3l9ANzHmtVX293YpW2WRGvzVwp1'],
// 		id: '2',
// 		duedate: new Date('2022-01-01')
// 	},
// 	{
// 		name: 'Project Y',
// 		members: ['t0Nc8M2apHWCV8SuucSFI4yhMq42', 'Z3l9ANzHmtVX293YpW2WRGvzVwp1'],
// 		id: '3',
// 		duedate: new Date('2022-02-01')
// 	},
// 	{
// 		name: 'Project Z',
// 		members: ['t0Nc8M2apHWCV8SuucSFI4yhMq42', 'Z3l9ANzHmtVX293YpW2WRGvzVwp1'],
// 		id: '4',
// 		duedate: new Date('2022-03-01')
// 	},
// 	{
// 		name: 'Project A',
// 		members: ['t0Nc8M2apHWCV8SuucSFI4yhMq42', 'Z3l9ANzHmtVX293YpW2WRGvzVwp1'],
// 		id: '5',
// 		duedate: new Date('2022-04-01')
// 	},
// 	{
// 		name: 'Project B',
// 		members: ['t0Nc8M2apHWCV8SuucSFI4yhMq42', 'Z3l9ANzHmtVX293YpW2WRGvzVwp1'],
// 		id: '6',
// 		duedate: new Date('2022-05-01')
// 	},
// 	{
// 		name: 'Project C',
// 		members: ['t0Nc8M2apHWCV8SuucSFI4yhMq42', 'Z3l9ANzHmtVX293YpW2WRGvzVwp1'],
// 		id: '7',
// 		duedate: new Date('2022-06-01')
// 	},
// 	{
// 		name: 'Project D',
// 		members: ['t0Nc8M2apHWCV8SuucSFI4yhMq42', 'Z3l9ANzHmtVX293YpW2WRGvzVwp1'],
// 		id: '8',
// 		duedate: new Date('2022-07-01')
// 	}
// ]);
