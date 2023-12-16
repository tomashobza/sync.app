import { get } from 'svelte/store';
import { projects, user_data, user_token } from './stores';
import { auth, db } from './firebase';
import {
	DocumentReference,
	Timestamp,
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
	where
} from 'firebase/firestore';
import type { Member, Project, Task } from './interfaces';
import type { Unsubscribe } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import toast from 'svelte-french-toast';
import { goto } from '$app/navigation';

/// PROJECTS

export const loadProjects = async () => {
	const q = query(collection(db, 'projects'));

	const unsubscribeProjects = onSnapshot(
		q,
		(querySnapshot) => {
			// toast.success('Projects updated');

			const projs: Project[] = [];

			Promise.all(
				querySnapshot.docs.map(async (docum) => {
					const data = docum.data();
					// Assuming duedate is a Firestore Timestamp, convert it to a Date
					data.duedate = new Date(data.duedate.toDate());

					if (!data?.members?.includes(get(user_token)?.uid)) return;

					const members: Member[] = [];

					if (data.members?.length > 0) {
						await Promise.all(
							data.members.map(async (uid: string) => {
								if (uid) {
									const docSnap = await getDoc(doc(db, 'users', uid));
									if (docSnap.exists()) {
										members.push(docSnap.data() as Member);
									}
								}
							})
						);
					}

					data['members'] = members;
					data['id'] = docum.id;

					data['links'] = data['links'] ?? [];

					// write all tasks from the subcollection tasks into data['tasks']
					const tasksCol = collection(db, 'projects', docum.id, 'tasks');
					const tasksSnap = await getDocs(tasksCol);
					const tasks: Task[] = [];
					tasksSnap.forEach((taskDoc) => {
						const taskData = taskDoc.data();
						taskData['id'] = taskDoc.id;

						// replace the assigned uid with the member object
						const assignedMember = members.find((member) => member.uid === taskData.assigned);
						taskData['assigned'] = assignedMember ?? taskData.assigned;

						tasks.push(taskData as any);
					});
					data['tasks'] = tasks;

					projs.push(data as Project);
				})
			)
				.then(() => {
					projs.sort((a, b) => a.duedate.getTime() - b.duedate.getTime());
					projects.set(projs);
				})
				.catch((error) => {
					console.error('Error processing documents: ', error);
				});
		},
		(error) => {
			console.error('Error listening to updates: ', error);
		}
	);
};

user_token.subscribe(loadProjects);

export const createProject = (projectData: {
	name: string;
	duedate: Timestamp;
	members: string[];
}) => addDoc(collection(db, 'projects'), projectData);
export const saveProject = (projectData: Project) => {
	const projectDocRef = doc(db, 'projects', projectData.id);
	const projectDataParsed: {
		id: string;
		name: string;
		duedate: Timestamp;
		members: string[];
		links: string[];
	} = {
		id: projectData.id,
		name: projectData.name,
		duedate: Timestamp.fromDate(projectData.duedate),
		members: projectData.members.map((member) => member.uid),
		links: projectData.links ?? []
	};

	return updateDoc(projectDocRef, projectDataParsed);
};

export const removeMemberFromProject = async (
	projectId: string,
	userId: string,
	members: string[]
): Promise<void> => {
	// Reference to the project document
	const projectDocRef = doc(db, 'projects', projectId);

	try {
		// Update the project document, removing the user ID from the 'members' array
		await updateDoc(projectDocRef, {
			members: members.filter((member) => member !== userId)
		});
		toast.success('User removed from project!');
		goto('/');
		// loadProjects();
	} catch (error) {
		toast.error('Error removing user ID from project!');
		console.error(error);
	}
};

export const getProjectTitle = async (projectId: string): Promise<string> => {
	const projectDocRef = await doc(db, 'projects', projectId);
	const projectDoc = await getDoc(projectDocRef);
	return await projectDoc.data()?.name;
};

export const addProjectMember = async (projectId: string) => {
	if (!get(user_token)?.uid) return;

	const projectDocRef = doc(db, 'projects', projectId);
	const projectDoc = await getDoc(projectDocRef);
	const projectData = projectDoc.data();
	const projectMembers: string[] = projectData?.members?.filter((v: string) => !!v) ?? [];
	get(user_token)?.uid && projectMembers.push(get(user_token)?.uid as string);

	try {
		await updateDoc(projectDocRef, {
			members: projectMembers
		});
	} catch (error) {
		console.error(error);
	}
};

export const updateProject = async (projectId: string, projectDataDiff: Partial<Project>) => {
	const projectDocRef = doc(db, 'projects', projectId);
	const projectDoc = await getDoc(projectDocRef);
	const projectData = projectDoc.data() as Project;

	try {
		await updateDoc(projectDocRef, {
			...projectData,
			...projectDataDiff
		});
	} catch (error) {
		console.error(error);
	}
};

export const deleteProject = async (projectId: string) => {
	const projectDocRef = doc(db, 'projects', projectId);

	const rusure = confirm('Are you sure you want to delete this project?');
	if (!rusure) return;

	try {
		await deleteDoc(projectDocRef);
	} catch (error) {
		console.error(error);
	}
};

export const createTask = async (projectId: string, taskData: Omit<Task, 'id'>) => {
	const tasksCol = collection(db, 'projects', projectId, 'tasks');
	try {
		await addDoc(tasksCol, taskData);
		toast.success('Task created!');
	} catch (error) {
		console.error(error);
	}
};

export const updateTask = async (
	projectId: string,
	taskId: string,
	taskData: Partial<Omit<Task, 'id'>>
) => {
	const taskDocRef = doc(db, 'projects', projectId, 'tasks', taskId);
	try {
		await updateDoc(taskDocRef, taskData);
	} catch (error) {
		console.error(error);
	}
};

export const removeTask = async (projectId: string, taskId: string) => {
	const taskDocRef = doc(db, 'projects', projectId, 'tasks', taskId);
	try {
		await deleteDoc(taskDocRef);
		toast.success('Task deleted!');
	} catch (error) {
		console.error(error);
	}
};

/// USERS

let unsubscribeUsers: Unsubscribe;
user_token.subscribe((user) => {
	if (user && user?.uid) {
		unsubscribeUsers?.();

		// Attach the onSnapshot listener
		const userDocRef = doc(db, 'users', user?.uid);
		unsubscribeUsers = onSnapshot(userDocRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				user_data.set(docSnapshot.data() as Member);
			} else {
				// TODO: handle no record for logged in user
				console.error('No such document for the user!');
			}
		});
	}
});

export const updateUser = async (userData: Partial<Member>): Promise<void> => {
	const user = get(user_token);
	if (!user) return;

	const userDocRef = doc(db, 'users', user.uid);
	try {
		await updateDoc(userDocRef, { ...get(user_data), ...userData });
		toast.success('User updated!');
	} catch (error) {
		toast.error('Error updating user!');
		console.error(error);
	}
};

export const updatePicture = async (file: File): Promise<void> => {
	const user = get(user_token);
	if (!user) return;

	const storage = getStorage();
	const storageRef = ref(storage, get(user_token)?.uid);

	toast
		.promise(uploadBytes(storageRef, file), {
			loading: 'Uploading picture...',
			success: 'Picture uploaded!',
			error: 'Error uploading picture!'
		})
		.then(async (snapshot) => {
			console.log('Uploaded a blob or file!', snapshot);
			updateUser({ photoURL: await getDownloadURL(snapshot.ref) });
			toast.success('Picture updated!');
		})
		.catch((error) => {
			toast.error('Error updating picture!');
			console.error(error);
		});
};

// Function to get favourite projects for a user
export const getFavouriteProjects = async (userId: string): Promise<string[]> => {
	try {
		const userRef = doc(db, 'users', userId);
		const userDoc = await getDoc(userRef);
		const userData = userDoc.data() as Member | undefined;
		return userData?.favourites ?? [];
	} catch (error) {
		console.error("Error fetching user's favourite projects:", error);
		throw error;
	}
};

// Function to add a favourite project for a user
export const addFavouriteProject = async (userId: string, projectId: string): Promise<void> => {
	try {
		const userRef = doc(db, 'users', userId);
		await updateDoc(userRef, {
			favourites: arrayUnion(projectId)
		});
	} catch (error) {
		console.error('Error adding favourite project:', error);
		throw error;
	}
};

// Function to remove a favourite project from a user
export const removeFavouriteProject = async (userId: string, projectId: string): Promise<void> => {
	try {
		const userRef = doc(db, 'users', userId);
		await updateDoc(userRef, {
			favourites: arrayRemove(projectId)
		});
	} catch (error) {
		console.error('Error removing favourite project:', error);
		throw error;
	}
};
