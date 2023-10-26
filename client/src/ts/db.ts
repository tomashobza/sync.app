import { get } from 'svelte/store';
import { projects } from './stores';
import { db } from './firebase';
import { addDoc, collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
import type { Project } from './interfaces';

export const pushShit = () => {
	get(projects).forEach(async (project) => {
		const projectCol = collection(db, 'projects');
		const projectDocRef = await addDoc(projectCol, {
			name: project.name,
			duedate: project.duedate,
			members: project.members.map((v) => v.id)
		});

		// project.members.forEach(async (member) => {
		// 	const membersCol = collection(projectDocRef, 'members');
		// 	await addDoc(membersCol, member);
		// });
	});
};

// export const fetchProjects = async () => {
// 	const projectsCol = collection(db, 'projects');
// 	console.log(projectsCol);
// 	const projectSnapshot = await getDocs(projectsCol);

// 	const projects = projectSnapshot.docs.map((doc) => ({
// 		id: doc.id,
// 		...doc.data()
// 	}));

// 	console.log(projects);
// };

const q = query(collection(db, 'projects'));
console.log(q);
const unsubscribe = onSnapshot(q, (querySnapshot) => {
	console.log(querySnapshot);
	const projs: Project[] = [];
	console.log(
		querySnapshot.forEach((doc) => {
			projs.push(doc.data() as Project);
		})
	);
	projs.map((proj) => {
		// make the firebase timestamp a Date object
		proj.duedate = (proj.duedate as any).toDate();

		return proj;
	});
	console.log(projs);
	projects.set(projs);
});
