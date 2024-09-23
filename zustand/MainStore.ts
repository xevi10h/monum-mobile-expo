import { create } from 'zustand';
import { State, Track } from 'react-native-track-player';
// import {MapView, Camera} from '@rnmapbox/maps';
import IPlace from '../shared/interfaces/IPlace';
// import Geolocation from '@react-native-community/geolocation';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

export interface IMain {
	activeTab: string;
	statePlayer: State;
	placeOfMedia: IPlace | null;
	currentUserLocation: [number, number] | null;
	hasInitByUrl: boolean;
	videoPlayer: boolean;
	videoUrl: string;
	currentTrack: Track | undefined;
	currentTrackIndex: number | undefined;
}

export const defaultMain: IMain = {
	activeTab: 'Map',
	statePlayer: State.Paused,
	placeOfMedia: null,
	currentUserLocation: null,
	hasInitByUrl: false,
	videoPlayer: false,
	videoUrl: '',
	currentTrack: undefined,
	currentTrackIndex: undefined,
};

interface MainState {
	main: IMain;
	setActiveTab: (activeTab: string) => void;
	setStatePlayer: (statePlayer: State) => void;
	setPlaceOfMedia: (placeOfMedia: IPlace | null) => void;
	setCurrentUserLocation: (
		currentUserLocation: [number, number] | null,
	) => void;
	setHasInitByUrl: (hasInitByUrl: boolean) => void;
	setDefaultMain: () => void;
	startWatchingLocation: () => void;
	stopWatchingLocation: () => void;
	setVideoPlayer: (videoPlayer: boolean) => void;
	setVideoUrl: (videoUrl: string) => void;
	setCurrentTrack: (currentTrack: Track | undefined) => void;
	setCurrentTrackIndex: (currentTrackIndex: number | undefined) => void;
}

export const useMainStore = create<MainState>((set) => ({
	main: defaultMain,
	setActiveTab: (activeTab: string) => {
		set((state) => ({ main: { ...state.main, activeTab } }));
	},
	setStatePlayer: (statePlayer: State) => {
		set((state) => ({ main: { ...state.main, statePlayer } }));
	},
	setPlaceOfMedia: (placeOfMedia: IPlace | null) => {
		set((state) => ({ main: { ...state.main, placeOfMedia } }));
	},
	setCurrentUserLocation: (currentUserLocation: [number, number] | null) => {
		set((state) => ({ main: { ...state.main, currentUserLocation } }));
	},
	setHasInitByUrl: (hasInitByUrl: boolean) => {
		set((state) => ({ main: { ...state.main, hasInitByUrl } }));
	},
	setDefaultMain: () => {
		set((state) => ({
			main: {
				...defaultMain,
				currentUserLocation: state.main.currentUserLocation,
			},
		}));
	},
	startWatchingLocation: () => {
		// const watchId = Location.watchPosition(
		// 	(position: any) => {
		// 		const { longitude, latitude } = position.coords;
		// 		set((state) => {
		// 			return {
		// 				main: { ...state.main, currentUserLocation: [longitude, latitude] },
		// 			};
		// 		});
		// 	},
		// 	(error: any) => {
		// 		console.error('Error watching position:', error);
		// 	},
		// 	{ enableHighAccuracy: true, distanceFilter: 1, interval: 1000 },
		// );
		// Location.startLocationUpdatesAsync(
		// 	'watchLocation',
		// 	({ data: { locations }, error }) => {
		// 		if (error) {
		// 			console.log('Error watching location:', error);
		// 			return;
		// 		}
		// 		console.log('Locations:', locations);
		// 		const [location] = locations;
		// 		if (location) {
		// 			const { longitude, latitude } = location.coords;
		// 			set((state) => ({
		// 				main: { ...state.main, currentUserLocation: [longitude, latitude] },
		// 			}));
		// 		}
		// 	},
		// );
		// // Then, request to start location updates with appropriate options:
		// async function startLocationUpdates() {
		// 	const hasPermission = await Location.requestForegroundPermissionsAsync();
		// 	if (hasPermission.status === 'granted') {
		// 		await Location.startLocationUpdatesAsync('watchLocation', {
		// 			accuracy: Location.Accuracy.High,
		// 			timeInterval: 5000, // Minimum time to wait between each update in milliseconds
		// 			distanceInterval: 5, // Receive updates only when the location has changed by at least this distance in meters
		// 		});
		// 	}
		// }
		// set((state) => ({ main: { ...state.main, watchId } }));
	},
	stopWatchingLocation: async () => {
		await Location.stopLocationUpdatesAsync('watchLocation');
	},
	setVideoPlayer: (videoPlayer: boolean) => {
		set((state) => ({ main: { ...state.main, videoPlayer } }));
	},
	setVideoUrl: (videoUrl: string) => {
		set((state) => ({ main: { ...state.main, videoUrl } }));
	},
	setCurrentTrack: (currentTrack: Track | undefined) => {
		set((state) => ({ main: { ...state.main, currentTrack } }));
	},
	setCurrentTrackIndex: (currentTrackIndex: number | undefined) => {
		set((state) => ({ main: { ...state.main, currentTrackIndex } }));
	},
}));
