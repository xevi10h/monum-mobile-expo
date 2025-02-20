import { create } from 'zustand';

import * as Location from 'expo-location';

interface LocationState {
	coords: Location.LocationObjectCoords | null;
	permissionStatus: Location.PermissionStatus | null;
	isBackgroundLocationEnabled: boolean;
	setBackgroundLocationEnabled: (enabled: boolean) => void;
	setCoords: (newCoords: Location.LocationObjectCoords) => void;
	setPermissionStatus: (status: Location.PermissionStatus) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
	coords: null,
	permissionStatus: null,
	isBackgroundLocationEnabled: false,
	setBackgroundLocationEnabled: (enabled) =>
		set({ isBackgroundLocationEnabled: enabled }),
	setCoords: (newCoords) => set({ coords: newCoords }),
	setPermissionStatus: (status) => set({ permissionStatus: status }),
}));
