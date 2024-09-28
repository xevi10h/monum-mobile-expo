import { create } from 'zustand';
import IRouteComplete from '../shared/interfaces/IRouteComplete';
import ICity from '../shared/interfaces/ICity';
import IRouteOfCity from '../shared/interfaces/IRouteOfCity';
import { IMarker } from '../shared/interfaces/IMarker';
// import {Camera} from '@rnmapbox/maps';

export interface TabRouteState {
	cities: ICity[];
	markerSelected: string | null;
	markers: IMarker[];
	setCities: (city: ICity[]) => void;
	setMarkerSelected: (markerSelected: string | null) => void;
	setMarkers: (markers: IMarker[]) => void;
	setDefaultTabRoute: () => void;
}

const defaultRouteOfCity: IRouteOfCity = {
	id: '',
	title: '',
	description: '',
	rating: 0,
	stopsCount: 0,
	cityId: '',
};

const defaultRouteComplete: IRouteComplete = {
	...defaultRouteOfCity,
	duration: 0,
	optimizedDuration: 0,
	distance: 0,
	optimizedDistance: 0,
	stops: [],
};

const defaultCity: ICity = {
	id: '',
	name: '',
	imageUrl: '',
};

export const useTabRouteStore = create<TabRouteState>((set) => ({
	cities: [],
	markerSelected: null,
	markers: [],
	setCities: (cities: ICity[]) => {
		set(() => ({ cities }));
	},
	setMarkerSelected: (markerSelected: string | null) => {
		set(() => ({ markerSelected }));
	},
	setMarkers: (markers: IMarker[]) => {
		set(() => ({ markers }));
	},
	setDefaultTabRoute: () => {
		set(() => ({
			routeOfCity: defaultRouteOfCity,
			routeComplete: defaultRouteComplete,
			city: defaultCity,
			markerSelected: null,
			markers: [],
			routeCameraCoordinates: [0, 0],
			forceUpdateRouteCamera: false,
		}));
	},
}));
