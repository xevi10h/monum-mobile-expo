/* eslint-disable react-hooks/exhaustive-deps */
import MapViewType, { Camera } from 'react-native-maps';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import MapView from '@/components/map/crossPlatformComponents/MapView';
import MapScreenButton from '@/components/map/MapScreenButton';
import { MarkerComponent } from '@/components/map/CustomMarker';
import MapPlaceDetail from '@/components/map/placeDetail/MapPlaceDetail';
import MapServices from '@/services/map/MapServices';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useMainStore } from '@/zustand/MainStore';
import TextSearchMapScreen from '@/components/map/TextSearchMapDisabled';
import { router } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import CurrentPositionMarker from '@/components/map/CurrentPositionMarker';
import * as Device from 'expo-device';

export default function MapScreen() {
	const mapViewRef = useRef<MapViewType>(null);
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
		try {
			// Verificar el estado del permiso
			if (!statusForegroundPermissions?.granted) {
				// Solicitar permisos si aún no se han concedido
				const newPermissions = await requestStatusForegroundPermissions();
				if (!newPermissions.granted) {
					// Manejar la situación si los permisos no son concedidos
					return; // Salir de la función si no hay permisos
				}
			}

			// Proceder con la obtención de la ubicación si el permiso está concedido
			let newPosition;
			if (!currentUserLocation) {
				newPosition = await Location.getCurrentPositionAsync();
				newPosition = [
					newPosition.coords.longitude,
					newPosition.coords.latitude,
				] as [number, number];
				setCurrentUserLocation(newPosition);
			}
			const position = currentUserLocation || newPosition;
			if (position && mapViewRef.current) {
				const newCamera: Camera = {
					center: {
						latitude: position[1],
						longitude: position[0],
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
			console.log('Recalculating current location');
			await centerCoordinatesButtonAction();
			setIsLoadingCoordinates(false);
		}
		if (!currentUserLocation) {
			recalculateCurrentLocation();
		}
	}, [currentUserLocation, mapViewRef.current]);

	return (
		currentUserLocation && (
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
					}}
				>
					<MapView
						provider={Platform.OS !== 'ios' ? 'google' : undefined}
						followsUserLocation
						showsUserLocation={
							Device.osName === 'Android' && Platform.OS === 'web'
								? false
								: true
						}
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
						googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB}
						options={{
							disableDefaultUI: true,
							clickableIcons: false,
						}}
						loadingFallback={<ActivityIndicator size="large" color="#3F713B" />}
					>
						{markers.map((marker, index) => (
							<MarkerComponent
								key={index}
								id={marker.id}
								importance={marker.importance}
								coordinates={marker.coordinates}
							/>
						))}
						{Device.osName === 'Android' && Platform.OS === 'web' ? (
							<CurrentPositionMarker />
						) : null}
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
