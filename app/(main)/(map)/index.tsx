/* eslint-disable react-hooks/exhaustive-deps */
import { Camera, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from '@/components/map/MapView';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import MapScreenButton from '@/components/map/MapScreenButton';
import { MarkerComponent } from '@/components/map/Marker';
import MapPlaceDetail from '@/components/map/placeDetail/MapPlaceDetail';
import MapServices from '@/services/map/MapServices';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useMainStore } from '@/zustand/MainStore';
import TextSearchMapScreen from '@/components/map/TextSearchMapDisabled';
import { router } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

export default function MapScreen() {
	const mapViewRef = useRef<MapView>(null);
	const [statusCameraPermissions, requestCameraPermissions] =
		useCameraPermissions();
	const [statusForegroundPermissions, requestStatusForegroundPermissions] =
		Location.useForegroundPermissions();
	const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
	const markerSelected = useTabMapStore((state) => state.tabMap.markerSelected);
	const currentUserLocation = useMainStore(
		(state) => state.main.currentUserLocation,
	);
	const markers = useTabMapStore((state) => state.tabMap.markers);
	const setMarkers = useTabMapStore((state) => state.setMarkers);

	const setCurrentUserLocation = useMainStore(
		(state) => state.setCurrentUserLocation,
	);

	useEffect(() => {
		const fetchMarkers = async () => {
			try {
				const markersData = await MapServices.getAllMarkers(
					'importance',
					'asc',
				);
				setMarkers(
					markersData.map((marker) => ({
						id: marker.id,
						coordinates: [
							marker.address.coordinates.lng,
							marker.address.coordinates.lat,
						] as [number, number],
						importance: marker.importance,
						selected: marker.id === markerSelected,
					})),
				);
			} catch (error) {
				console.error(error);
			}
		};
		fetchMarkers();
	}, []);

	useEffect(() => {
		if (markerSelected && markers.length > 0) {
			console.log('markerSelected', markerSelected);
			const coordinatesToSet =
				markers?.find((m) => m.id === markerSelected)?.coordinates ||
				currentUserLocation;
			if (coordinatesToSet) {
				const newCamera: Camera = {
					center: {
						latitude: coordinatesToSet[1],
						longitude: coordinatesToSet[0],
					},
					zoom: 18,
					heading: 0,
					pitch: 0,
					altitude: 10,
				};
				mapViewRef?.current?.animateCamera(newCamera, { duration: 1000 });
			}
		}
	}, [markerSelected]);

	const centerCoordinatesButtonAction = async () => {
		console.log('statusForegroundPermissions', statusForegroundPermissions);
		try {
			// Verificar el estado del permiso
			if (!statusForegroundPermissions?.granted) {
				// Solicitar permisos si aún no se han concedido
				const newPermissions = await requestStatusForegroundPermissions();
				if (!newPermissions.granted) {
					// Manejar la situación si los permisos no son concedidos
					console.log('Permission not granted or not requestable.');
					return; // Salir de la función si no hay permisos
				}
			}

			// Proceder con la obtención de la ubicación si el permiso está concedido
			if (!currentUserLocation) {
				const position = await Location.getCurrentPositionAsync();
				console.log('Current position:', position);
				const { longitude, latitude } = position.coords;
				setCurrentUserLocation([longitude, latitude]);
			}
			if (currentUserLocation) {
				const newCamera: Camera = {
					center: {
						latitude: currentUserLocation[1],
						longitude: currentUserLocation[0],
					},
					zoom: 15,
					heading: 0,
					pitch: 0,
					altitude: 10,
				};
				mapViewRef?.current?.animateCamera(newCamera, { duration: 1000 });
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		async function prepareWhenAuthenticated() {
			await centerCoordinatesButtonAction();
		}
		prepareWhenAuthenticated();
	}, []);

	useEffect(() => {
		async function recalculateCurrentLocation() {
			await centerCoordinatesButtonAction();
			setIsLoadingCoordinates(false);
		}
		if (!currentUserLocation) {
			recalculateCurrentLocation();
		}
	}, [currentUserLocation]);

	return (
		currentUserLocation && (
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
					}}
				>
					<MapView
						provider={PROVIDER_GOOGLE}
						followsUserLocation
						showsUserLocation={Platform.OS === 'ios'}
						ref={mapViewRef}
						style={{
							flex: 1,
						}}
						camera={{
							center: {
								latitude: currentUserLocation[1] || 0,
								longitude: currentUserLocation[0] || 0,
							},
							heading: 10,
							pitch: 0,
							zoom: 15,
							altitude: 10,
						}}
					>
						{markers.map((marker) => (
							<MarkerComponent
								key={marker.id}
								id={marker.id}
								importance={marker.importance}
								coordinates={marker.coordinates}
							/>
						))}
					</MapView>
				</View>
				<MapScreenButton
					onPress={async () => {
						try {
							if (
								statusCameraPermissions?.canAskAgain &&
								!statusCameraPermissions?.granted
							) {
								await requestCameraPermissions();
							}
						} catch (error) {
							console.log(error);
						}
						router.push('/qr-scanner');
					}}
					image={require('@/assets/images/map_qr_scanner.png')}
					additionalBottom={60}
				/>
				<MapScreenButton
					onPress={async () => await centerCoordinatesButtonAction()}
					image={require('@/assets/images/map_center_coordinates.png')}
				/>
				<MapPlaceDetail />
				<TextSearchMapScreen
					onPress={() => {
						router.push('/text-search');
					}}
				/>
				{isLoadingCoordinates && (
					<View
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'transparent',
						}}
					>
						<ActivityIndicator size="large" color="#3F713B" />
					</View>
				)}
			</View>
		)
	);
}
