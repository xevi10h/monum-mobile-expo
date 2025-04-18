import MapViewType, { Camera } from 'react-native-maps';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import MapView from '@/components/map/crossPlatformComponents/MapView';
import MapScreenButton from '@/components/map/MapScreenButton';
import { MarkerComponent } from '@/components/map/CustomMarker';
import MapPlaceDetail from '@/components/map/placeDetail/MapPlaceDetail';
import MapServices from '@/services/map/MapServices';
import { useTabMapStore } from '@/zustand/TabMapStore';
import TextSearchMapScreen from '@/components/map/TextSearchMapDisabled';
import { router, useLocalSearchParams } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import CurrentPositionMarker from '@/components/map/CurrentPositionMarker';
import { useUserStore } from '@/zustand/UserStore';
import AuthServices from '@/services/auth/AuthServices';

export default function MapScreen() {
	const { placeId } = useLocalSearchParams();
	const mapViewRef = useRef<MapViewType>(null);
	const [statusCameraPermissions, requestCameraPermissions] =
		useCameraPermissions();
	const [statusForegroundPermissions, requestStatusForegroundPermissions] =
		Location.useForegroundPermissions();
	const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
	const markerSelected = useTabMapStore((state) => state.tabMap.markerSelected);
	const citySelectedCoordinates = useTabMapStore(
		(state) => state.tabMap.citySelectedCoordinates,
	);

	const markers = useTabMapStore((state) => state.tabMap.markers);
	const setMarkers = useTabMapStore((state) => state.setMarkers);
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const setMarkerSelected = useTabMapStore((state) => state.setMarkerSelected);
	const setPlace = useTabMapStore((state) => state.setPlace);
	const setMediasOfPlace = useTabMapStore((state) => state.setMediasOfPlace);
	const setShowPlaceDetailExpanded = useTabMapStore(
		(state) => state.setShowPlaceDetailExpanded,
	);
	const setTextSearchIsLoading = useTabMapStore(
		(state) => state.setTextSearchIsLoading,
	);

	useEffect(() => {
		async function placeSelected() {
			if (placeId && typeof placeId === 'string' && mapViewRef.current) {
				if (!user.token) {
					const guestUser = await AuthServices.loginAsGuest();
					setUser(guestUser);
				}
				setTextSearchIsLoading(true);
				const placeData = await MapServices.getPlaceInfo(
					placeId,
					'mapTextSearch',
				);
				const mediasFetched = await MapServices.getPlaceMedia(placeId);
				setTextSearchIsLoading(false);
				setPlace(placeData);
				setMarkerSelected(placeId);
				setMediasOfPlace(mediasFetched);
				setShowPlaceDetailExpanded(false);
			}
		}
		placeSelected();
	}, [placeId, mapViewRef]);
	useEffect(() => {
		const fetchMarkers = async () => {
			try {
				setIsLoadingCoordinates(true);
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
				setIsLoadingCoordinates(false);
			} catch (error) {
				console.error(error);
			}
		};
		fetchMarkers();
	}, []);

	useEffect(() => {
		if (markerSelected && markers.length > 0 && mapViewRef.current) {
			const coordinatesToSet = markers?.find(
				(m) => m.id === markerSelected,
			)?.coordinates;

			if (coordinatesToSet) {
				const newCamera: Camera = {
					center: {
						latitude: coordinatesToSet[1],
						longitude: coordinatesToSet[0],
					},
					zoom: 18,
					heading: 0,
					pitch: 0,
					altitude: 500,
				};
				mapViewRef.current?.animateCamera(newCamera, { duration: 1000 });
			}
		}
	}, [markerSelected, markers, mapViewRef.current]);

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

			const { coords } = await Location.getCurrentPositionAsync();
			const { longitude, latitude } = coords;
			if (longitude && latitude && mapViewRef.current) {
				const newCamera: Camera = {
					center: {
						latitude,
						longitude,
					},
					zoom: 16,
					heading: 0,
					pitch: 0,
					altitude: 1000,
				};
				mapViewRef.current?.animateCamera(newCamera, { duration: 1000 });
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (citySelectedCoordinates) {
			const newCamera: Camera = {
				center: citySelectedCoordinates,
				zoom: 13,
				heading: 0,
				pitch: 0,
				altitude: 30000,
			};
			mapViewRef.current?.animateCamera(newCamera, { duration: 1000 });
		}
	}, [citySelectedCoordinates]);

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
				}}
			>
				<MapView
					provider={Platform.OS !== 'ios' ? 'google' : undefined}
					ref={mapViewRef}
					style={{
						flex: 1,
					}}
					showsUserLocation
					showsMyLocationButton={false}
					showsCompass={false}
					showsBuildings={false}
					showsIndoors={false}
					showsScale={false}
					showsTraffic={false}
					showsIndoorLevelPicker={false}
				>
					{markers.map((marker, index) => (
						<MarkerComponent
							key={index}
							id={marker.id}
							importance={marker.importance}
							coordinates={marker.coordinates}
						/>
					))}
					{Platform.OS === 'web' ? <CurrentPositionMarker /> : null}
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
					router.push('/place/qr-scanner');
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
					router.push('/place/text-search');
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
	);
}
