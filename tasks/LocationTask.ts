import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { useLocationStore } from '@/zustand/LocationStore';

export const LOCATION_TASK_NAME = 'location-background-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
	if (error) {
		console.error('Error en la tarea de ubicación en segundo plano:', error);
		return;
	}
	if (data) {
		const { locations } = data as { locations: Location.LocationObject[] };
		const location = locations[0];
		if (location) {
			const setCoords = useLocationStore.getState().setCoords;
			setCoords(location.coords);
		}
	}
});
