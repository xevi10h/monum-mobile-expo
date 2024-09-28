import { create } from 'zustand';
import { State, Track } from 'react-native-track-player';
import IPlace from '../shared/interfaces/IPlace';
import * as Location from 'expo-location';

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
	startWatchingLocation: () => {},
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
