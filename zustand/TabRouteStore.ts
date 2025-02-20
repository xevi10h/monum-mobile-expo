import { create } from 'zustand';
import IRouteComplete from '../shared/interfaces/IRouteComplete';
import ICity from '../shared/interfaces/ICity';
import { IMarker } from '../shared/interfaces/IMarker';

export interface TabRouteState {
	cities: ICity[];
	markerSelected: string | null;
	markers: IMarker[];
	route: IRouteComplete | null;
	setCities: (city: ICity[]) => void;
	setMarkerSelected: (markerSelected: string | null) => void;
	setMarkers: (markers: IMarker[]) => void;
	setRoute: (route: IRouteComplete) => void;
}

export const useTabRouteStore = create<TabRouteState>((set) => ({
	cities: [],
	markerSelected: null,
	markers: [],
	route: null,
	setCities: (cities: ICity[]) => {
		set(() => ({ cities }));
	},
	setMarkerSelected: (markerSelected: string | null) => {
		set(() => ({ markerSelected }));
	},
	setMarkers: (markers: IMarker[]) => {
		set(() => ({ markers }));
	},
	setRoute: (route: IRouteComplete) => {
		set(() => ({ route }));
	},
}));
