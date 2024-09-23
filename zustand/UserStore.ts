import { create } from 'zustand';
import IUser from '../shared/interfaces/IUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../shared/types/Language';

interface UserState {
	user: IUser;
	token: string | null;
	setAuthToken: (token: string) => Promise<void>;
	removeAuthToken: () => Promise<void>;
	setUser: (user: IUser) => void;
	updatePhoto: (photo: string) => void;
	updateUsername: (username: string) => void;
	setDefaultUser: () => Promise<void>;
	setLanguage: (language: Language) => void;
	initializeToken: () => Promise<void>;
}

export const undefinedUser: IUser = {
	id: '',
	email: '',
	username: '',
	createdAt: new Date().toISOString(),
	name: '',
	photo: '',
	googleId: '',
	token: '',
	hasPassword: false,
	language: 'ca_ES',
	permissions: [],
};

export const useUserStore = create<UserState>((set, get) => ({
	user: undefinedUser,
	token: null,
	setAuthToken: async (token: string) => {
		try {
			await AsyncStorage.setItem('authToken', token);
			set({ token, user: { ...get().user, token } });
		} catch (error) {
			console.error('Error saving authentication token:', error);
		}
	},
	removeAuthToken: async () => {
		try {
			await AsyncStorage.removeItem('authToken');
			set({ token: null, user: { ...get().user, token: '' } });
		} catch (error) {
			console.error('Error removing authentication token:', error);
		}
	},
	setUser: (user: IUser) => {
		set((state) => ({
			user: { ...state.user, ...user },
			token: user.token || state.token, // Actualiza el token si está presente en el usuario
		}));
	},
	updatePhoto: (photo: string) => {
		set((state) => ({ user: { ...state.user, photo } }));
	},
	updateUsername: (username: string) => {
		set((state) => ({ user: { ...state.user, username } }));
	},
	setDefaultUser: async () => {
		set({
			user: { ...undefinedUser, language: get().user.language },
			token: null,
		});
		await AsyncStorage.removeItem('authToken');
	},
	setLanguage: (language: Language) => {
		set((state) => ({ user: { ...state.user, language } }));
	},
	initializeToken: async () => {
		try {
			const currentUserToken = get().user.token;
			if (currentUserToken) {
				set({ token: currentUserToken });
			} else {
				const storedToken = await AsyncStorage.getItem('authToken');
				set({ token: storedToken });
			}
		} catch (error) {
			console.error('Error initializing token:', error);
		}
	},
}));
