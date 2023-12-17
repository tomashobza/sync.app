/**
 * @module db functions
 * @description
 * Provides functions for accessing the Firestore database.
 * @author everyone, ...
 */

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

/**
 * Loads projects from the Firestore database and updates the projects state.
 *
 * @returns {Promise<void>} A promise that resolves when the projects are loaded and updated.
 * @author Tomáš Hobza (xhobza03)
 */
export const loadProjects = async () => {
	const q = query(collection(db, 'projects'));

	const unsubscribeProjects = onSnapshot(
		q,
		(querySnapshot) => {
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

user_token.subscribe(loadProjects); // load projects when user is logged in or out

/**
 * Creates a new project in the database.
 * @param projectData - The data of the project to be created.
 * @returns A promise that resolves with the newly created project document.
 * @author Anastasia Butok (xbutok00)
 */
export const createProject = (projectData: {
	name: string;
	duedate: Timestamp;
	members: string[];
}) => addDoc(collection(db, 'projects'), projectData);

/**
 * Saves the project data to the database.
 *
 * @param projectData - The project data to be saved.
 * @returns A promise that resolves when the project data is successfully saved.
 * @author Nikita Koliada (xkolia00)
 */
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

/**
 * Removes a member from a project.
 *
 * @param projectId - The ID of the project.
 * @param userId - The ID of the user to be removed.
 * @param members - The array of members in the project.
 * @returns A Promise that resolves to void.
 * @author Nikita Koliada (xkolia00)
 */
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

/**
 * Retrieves the title of a project from the database.
 * @param projectId - The ID of the project.
 * @returns A Promise that resolves to the project title.
 * @author Tomáš Hobza (xhobza03)
 */
export const getProjectTitle = async (projectId: string): Promise<string> => {
	const projectDocRef = await doc(db, 'projects', projectId);
	const projectDoc = await getDoc(projectDocRef);
	return await projectDoc.data()?.name;
};

/**
 * Adds a project member to the specified project.
 *
 * @param projectId - The ID of the project to add the member to.
 * @returns A Promise that resolves when the member is successfully added, or rejects with an error if an error occurs.
 * @author Nikita Koliada (xkolia00)
 */
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

/**
 * Updates a project in the database with the provided changes.
 *
 * @param projectId - The ID of the project to update.
 * @param projectDataDiff - The partial project object containing the changes to apply.
 * @returns A Promise that resolves when the project is successfully updated, or rejects with an error.
 * @author Nikita Koliada (xkolia00)
 */
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

/**
 * Deletes a project from the database.
 *
 * @param projectId - The ID of the project to be deleted.
 * @author Nikita Koliada (xkolia00)
 */
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

/**
 * Creates a new task for a specific project.
 *
 * @param projectId - The ID of the project.
 * @param taskData - The data of the task to be created.
 * @returns A promise that resolves when the task is successfully created.
 * @author Tomáš Hobza (xhobza03)
 */
export const createTask = async (projectId: string, taskData: Omit<Task, 'id'>) => {
	const tasksCol = collection(db, 'projects', projectId, 'tasks');
	try {
		await addDoc(tasksCol, taskData);
		toast.success('Task created!');
	} catch (error) {
		console.error(error);
	}
};

/**
 * Updates a task in the database.
 *
 * @param projectId - The ID of the project containing the task.
 * @param taskId - The ID of the task to update.
 * @param taskData - The partial task data to update.
 * @author Anastasia Butok (xbutok00)
 */
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

/**
 * Removes a task from a project.
 *
 * @param projectId - The ID of the project.
 * @param taskId - The ID of the task to be removed.
 * @author Tomáš Hobza (xhobza03)
 */
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

/**
 * @author Anastasia Butok (xbutok00)
 */
let unsubscribeUsers: Unsubscribe;
user_token.subscribe((user) => {
	if (user && user?.uid) {
		unsubscribeUsers?.();

		// Attach the onSnapshot listener
		/**
		 * Reference to the document in the 'users' collection with the specified user ID.
		 */
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

/**
 * Updates the user data in the database.
 *
 * @param userData - The partial user data to update.
 * @returns A promise that resolves when the user data is updated.
 * @author Tomáš Hobza (xhobza03)
 */
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

/**
 * Updates the user's picture with the provided file.
 *
 * @param file - The file to upload as the user's picture.
 * @returns A Promise that resolves when the picture is successfully updated, or rejects with an error if there was an issue.
 * @author Tomáš Hobza (xhobza03)
 */
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
/**
 * Retrieves the favourite projects of a user.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of strings representing the favourite projects.
 * @throws If there is an error fetching the user's favourite projects.
 * @author Tomáš Hobza (xhobza03)
 */
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
/**
 * Adds a project to the user's list of favourite projects.
 *
 * @param userId - The ID of the user.
 * @param projectId - The ID of the project to be added as a favourite.
 * @returns A Promise that resolves when the project is successfully added.
 * @throws If there is an error adding the favourite project.
 * @author Tomáš Hobza (xhobza03)
 */
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
/**
 * Removes a project from the list of favourite projects for a user.
 *
 * @param userId - The ID of the user.
 * @param projectId - The ID of the project to be removed.
 * @returns A Promise that resolves when the project is successfully removed.
 * @throws If there is an error removing the favourite project.
 * @author Tomáš Hobza (xhobza03)
 */
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
