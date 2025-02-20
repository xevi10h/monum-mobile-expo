import { create } from 'zustand';
import { State, Track } from 'react-native-track-player';
import IPlace from '../shared/interfaces/IPlace';

export interface CustomTrack extends Track {
	rating?: number;
	text?: string;
	mediaType?: 'audio' | 'text' | 'video';
	alredyRated?: boolean;
}

export interface ReviewModalProps {
	entityType: 'place' | 'route' | 'media';
	entityId: string;
	entityTitle: string;
	mediaType?: 'video' | 'text' | 'audio';
}

export interface IMain {
	statePlayer: State;
	placeOfMedia: IPlace | null;
	coords: { latitude: number; longitude: number } | null;
	videoPlayer: boolean;
	videoUrl: string;
	currentTrack: CustomTrack | undefined;
	currentTrackIndex: number | undefined;
	isGeneralLoading: boolean;
	reviewModal: ReviewModalProps | null;
}

export const defaultMain: IMain = {
	statePlayer: State.Paused,
	placeOfMedia: null,
	coords: null,
	videoPlayer: false,
	videoUrl: '',
	currentTrack: undefined,
	currentTrackIndex: undefined,
	isGeneralLoading: false,
	reviewModal: null,
};

interface MainState {
	main: IMain;
	setStatePlayer: (statePlayer: State) => void;
	setPlaceOfMedia: (placeOfMedia: IPlace | null) => void;
	setHasInitByUrl: (hasInitByUrl: boolean) => void;
	setDefaultMain: () => void;
	setVideoPlayer: (videoPlayer: boolean) => void;
	setVideoUrl: (videoUrl: string) => void;
	setCurrentTrack: (currentTrack: CustomTrack | undefined) => void;
	setCurrentTrackIndex: (currentTrackIndex: number | undefined) => void;
	setIsGeneralLoading: (isGeneralLoading: boolean) => void;
	setReviewModal: (reviewModal: ReviewModalProps | null) => void;
}

export const useMainStore = create<MainState>((set) => ({
	main: defaultMain,
	setStatePlayer: (statePlayer: State) => {
		set((state) => ({ main: { ...state.main, statePlayer } }));
	},
	setPlaceOfMedia: (placeOfMedia: IPlace | null) => {
		set((state) => ({ main: { ...state.main, placeOfMedia } }));
	},
	setHasInitByUrl: (hasInitByUrl: boolean) => {
		set((state) => ({ main: { ...state.main, hasInitByUrl } }));
	},
	setDefaultMain: () => {
		set(() => ({
			main: defaultMain,
		}));
	},
	setVideoPlayer: (videoPlayer: boolean) => {
		set((state) => ({ main: { ...state.main, videoPlayer } }));
	},
	setVideoUrl: (videoUrl: string) => {
		set((state) => ({ main: { ...state.main, videoUrl } }));
	},
	setCurrentTrack: (currentTrack: CustomTrack | undefined) => {
		set((state) => ({ main: { ...state.main, currentTrack } }));
	},
	setCurrentTrackIndex: (currentTrackIndex: number | undefined) => {
		set((state) => ({ main: { ...state.main, currentTrackIndex } }));
	},
	setIsGeneralLoading: (isGeneralLoading: boolean) => {
		set((state) => ({ main: { ...state.main, isGeneralLoading } }));
	},
	setReviewModal: (reviewModal: ReviewModalProps | null) => {
		set((state) => ({ main: { ...state.main, reviewModal } }));
	},
}));
