import { create } from 'zustand';
import IPlace from '../shared/interfaces/IPlace';
import IMedia from '../shared/interfaces/IMedia';
import { IMarker } from '../shared/interfaces/IMarker';
import { ISearchResult } from '../shared/interfaces/ISearchResult';
import { Camera } from 'react-native-maps';

export interface ITabMap {
	markerSelected: string | null;
	lastMarkerSelected: string | null;
	place: IPlace | null;
	showPlaceDetailExpanded: boolean;
	mediasOfPlace: IMedia[] | undefined;
	expandedMediaDetail: boolean;
	markers: IMarker[];
	forceUpdateMapCamera: boolean;
	textSearch: string | undefined;
	searcherResults: ISearchResult[];
	textSearchIsLoading: boolean;
	citySelectedCoordinates: Camera['center'] | null;
	importancesSelected: number[];
	isImportanceFilterActive: boolean;
}

export const defaultTabMap: ITabMap = {
	markerSelected: null,
	lastMarkerSelected: null,
	place: null,
	showPlaceDetailExpanded: false,
	mediasOfPlace: undefined,
	expandedMediaDetail: false,
	markers: [],
	forceUpdateMapCamera: false,
	textSearch: undefined,
	searcherResults: [],
	textSearchIsLoading: false,
	citySelectedCoordinates: null,
	importancesSelected: [1, 2, 3],
	isImportanceFilterActive: false,
};

interface TabMapState {
	tabMap: ITabMap;
	setMarkerSelected: (markerSelected: string | null) => void;
	setLastMarkerSelected: (markerSelected: string | null) => void;
	setPlace: (place: IPlace | null) => void;
	setShowPlaceDetailExpanded: (showPlaceDetailExpanded: boolean) => void;
	setMediasOfPlace: (mediasOfPlace: IMedia[] | undefined) => void;
	setExpandedMediaDetail: (expandedMediaDetail: boolean) => void;
	setMarkers: (markers: IMarker[]) => void;
	setDefaultTabMap: () => void;
	setTextSearch: (textSearch: string | undefined) => void;
	setSearcherResults: (searcherResults: ISearchResult[]) => void;
	setTextSearchIsLoading: (textSearchIsLoading: boolean) => void;
	setCitySelectedCoordinates: (
		citySelectedCoordinates: Camera['center'] | null,
	) => void;
	setImportancesSelected: (importancesSelected: number[]) => void;
	setIsImportanceFilterActive: (isImportanceFilterActive: boolean) => void;
}

export const useTabMapStore = create<TabMapState>((set) => ({
	tabMap: defaultTabMap,
	setMarkerSelected: (markerSelected: string | null) => {
		set((state) => ({
			tabMap: {
				...state.tabMap,
				lastMarkerSelected: state.tabMap.markerSelected,
				markerSelected,
			},
		}));
	},
	setLastMarkerSelected: (lastMarkerSelected: string | null) => {
		set((state) => ({ tabMap: { ...state.tabMap, lastMarkerSelected } }));
	},
	setPlace: (place: IPlace | null) => {
		set((state) => ({ tabMap: { ...state.tabMap, place } }));
	},
	setShowPlaceDetailExpanded: (showPlaceDetailExpanded: boolean) => {
		set((state) => ({
			tabMap: { ...state.tabMap, showPlaceDetailExpanded },
		}));
	},
	setMediasOfPlace: (mediasOfPlace: IMedia[] | undefined) => {
		set((state) => ({ tabMap: { ...state.tabMap, mediasOfPlace } }));
	},
	setExpandedMediaDetail: (expandedMediaDetail: boolean) => {
		set((state) => ({ tabMap: { ...state.tabMap, expandedMediaDetail } }));
	},
	setMarkers: (markers: IMarker[]) => {
		set((state) => ({ tabMap: { ...state.tabMap, markers } }));
	},
	setDefaultTabMap: () => {
		set(() => ({ tabMap: defaultTabMap }));
	},
	setTextSearch: (textSearch: string | undefined) => {
		set((state) => ({ tabMap: { ...state.tabMap, textSearch } }));
	},
	setSearcherResults: (searcherResults: ISearchResult[]) => {
		set((state) => ({ tabMap: { ...state.tabMap, searcherResults } }));
	},
	setTextSearchIsLoading: (textSearchIsLoading: boolean) => {
		set((state) => ({ tabMap: { ...state.tabMap, textSearchIsLoading } }));
	},
	setCitySelectedCoordinates: (
		citySelectedCoordinates: Camera['center'] | null,
	) => {
		set((state) => ({ tabMap: { ...state.tabMap, citySelectedCoordinates } }));
	},
	setImportancesSelected: (importancesSelected: number[]) => {
		set((state) => ({ tabMap: { ...state.tabMap, importancesSelected } }));
	},
	setIsImportanceFilterActive: (isImportanceFilterActive: boolean) => {
		set((state) => ({ tabMap: { ...state.tabMap, isImportanceFilterActive } }));
	},
}));
