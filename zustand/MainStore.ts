import { create } from 'zustand';
import { State, Track } from 'react-native-track-player';
import IPlace from '../shared/interfaces/IPlace';
import * as Location from 'expo-location';

export interface IMain {
	statePlayer: State;
	placeOfMedia: IPlace | null;
	currentUserLocation: [number, number] | null;
	videoPlayer: boolean;
	videoUrl: string;
	currentTrack: Track | undefined;
	currentTrackIndex: number | undefined;
	isGeneralLoading: boolean;
}

export const defaultMain: IMain = {
	statePlayer: State.Paused,
	placeOfMedia: null,
	currentUserLocation: null,
	videoPlayer: false,
	videoUrl: '',
	currentTrack: undefined,
	currentTrackIndex: undefined,
	isGeneralLoading: false,
};

interface MainState {
	main: IMain;
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
	setIsGeneralLoading: (isGeneralLoading: boolean) => void;
}

export const useMainStore = create<MainState>((set) => ({
	main: defaultMain,
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
	setIsGeneralLoading: (isGeneralLoading: boolean) => {
		set((state) => ({ main: { ...state.main, isGeneralLoading } }));
	},
}));
