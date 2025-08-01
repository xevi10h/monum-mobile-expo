/* eslint-disable react-hooks/exhaustive-deps */
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Platform,
	Text,
	View,
} from 'react-native';
import MapViewOriginal, { Camera } from 'react-native-maps';
import MapView from '@/components/map/crossPlatformComponents/MapView';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ROUTE_DETAIL } from '@/graphql/queries/routeQueries';
import { MarkerComponent } from '@/components/routes/CustomMarker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import RatingPill from '@/components/routes/RatingPill';
import TextSearch from '@/components/routes/TextSearch';

import IStop from '../../../../shared/interfaces/IStop';
import CenterCoordinatesButton from '@/components/routes/CenterCoordinatesButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useTabRouteStore } from '../../../../zustand/TabRouteStore';
import * as Location from 'expo-location';
import CenterStopsButton from '@/components/routes/CenterStopsButton';
import { IMarker } from '../../../../shared/interfaces/IMarker';
import { useUserStore } from '../../../../zustand/UserStore';
import { router, useLocalSearchParams } from 'expo-router';
import StopFromRoutePill from '@/components/routes/placeFromRoutePill/StopFromRoutePill';
import CurrentPositionMarker from '@/components/map/CurrentPositionMarker';
import RateRouteButton from '@/components/routes/RateRouteButton';

export interface StopFromRoutePillInterface extends IStop {
	isExpanded: boolean;
	isHighlighted: boolean;
}

export default function RouteDetailScreen() {
	const { routeId, cityId } = useLocalSearchParams();
	const mapViewRef = useRef<MapViewOriginal>(null);
	const route = useTabRouteStore((state) => state.route);
	const setRoute = useTabRouteStore((state) => state.setRoute);
	const scrollViewRef = useRef<ScrollView>(null);
	const [statusForegroundPermissions, requestStatusForegroundPermissions] =
		Location.useForegroundPermissions();
	const [stopsFromRoute, setStopsFromRoute] = useState<
		StopFromRoutePillInterface[]
	>([]);
	const markerSelected = useTabRouteStore((state) => state.markerSelected);
	const markers = useTabRouteStore((state) => state.markers);
	const setMarkers = useTabRouteStore((state) => state.setMarkers);
	const setMarkerSelected = useTabRouteStore(
		(state) => state.setMarkerSelected,
	);
	const language = useUserStore((state) => state.user.language);
	const [textSearch, setTextSearch] = useState<string | undefined>(undefined);

	const centerStopsCamera = async () => {
		if (!mapViewRef.current) {
			console.log('Camera not ready');
			return;
		}
		mapViewRef?.current.fitToCoordinates(
			markers.map((m) => ({
				latitude: m.coordinates[1],
				longitude: m.coordinates[0],
			})),
			{
				edgePadding: {
					top: 30,
					left: 30,
					right: 30,
					bottom: 30,
				},
				animated: true,
			},
		);
	};

	const { loading, error, data, refetch } = useQuery(GET_ROUTE_DETAIL, {
		variables: {
			routeId: routeId,
		},
	});

	useEffect(() => {
		if (markers.length > 0) {
			mapViewRef?.current?.fitToCoordinates(
				markers.map((m) => ({
					latitude: m.coordinates[1],
					longitude: m.coordinates[0],
				})),
				{
					edgePadding: {
						top: 30,
						left: 30,
						right: 30,
						bottom: 30,
					},
					animated: true,
				},
			);
		}
	}, [markers]);

	useEffect(() => {
		async function fetchStops() {
			try {
				const response = await refetch();
				if (response && response.data) {
					setRoute(response.data.route);
				}
			} catch (error) {
				console.error('Error trying to get stops:', error);
			}
		}
		fetchStops();
	}, [textSearch, refetch, language, routeId]);

	useEffect(() => {
		if (route) {
			const stops = route?.stops;
			const filteredStops = textSearch
				? stops.filter(
						(marker: IStop) =>
							marker?.place?.name
								.toLowerCase()
								.includes(textSearch.toLowerCase()) ||
							marker?.place?.description
								.toLowerCase()
								.includes(textSearch.toLowerCase()),
				  )
				: stops;
			const stopsFromRoute: StopFromRoutePillInterface[] = filteredStops.map(
				(stop: IStop) => ({
					...stop,
					isExpanded: false,
					isHighlighted: false,
					totalStops: stops.length,
				}),
			) as StopFromRoutePillInterface[];
			const markers: IMarker[] = filteredStops.map((marker: any) => ({
				id: marker.place.id,
				coordinates: [
					marker.place.address.coordinates.lng,
					marker.place.address.coordinates.lat,
				],
				importance: marker.place.importance,
			}));
			setMarkers(markers);

			setStopsFromRoute(stopsFromRoute);
		}
	}, [textSearch, route]);

	useEffect(() => {
		async function markerIsSelected() {
			if (markerSelected && markers.length > 0) {
				setStopsFromRoute(
					stopsFromRoute.map((stop) => ({
						...stop,
						isExpanded: stop.isExpanded || stop.place.id === markerSelected,
						isHighlighted:
							stop.isHighlighted || stop.place.id === markerSelected,
					})),
				);

				const coordinatesToSet = markers?.find(
					(m) => m.id === markerSelected,
				)?.coordinates;
				if (coordinatesToSet) {
					const newCamera: Camera = {
						center: {
							latitude: coordinatesToSet[1],
							longitude: coordinatesToSet[0],
						},
						zoom: 15,
						heading: 0,
						pitch: 0,
						altitude: 10,
					};
					mapViewRef?.current?.animateCamera(newCamera, { duration: 1000 });
				}
				let height = 0;
				for (const place of stopsFromRoute) {
					if (place.place.id === markerSelected) {
						break;
					}
					const pill = stopsFromRoute?.find(
						(stop) => stop.place.id === place.place.id,
					);
					height += pill?.isExpanded ? 230 : 80;
				}

				setTimeout(() => {
					scrollViewRef.current?.scrollTo({ y: height, animated: true });
				}, 300);
			}
		}
		markerIsSelected();
	}, [markerSelected]);

	const centerCoordinatesButtonAction = async () => {
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

			const { coords } = await Location.getCurrentPositionAsync();
			const { longitude, latitude } = coords;
			if (longitude && latitude) {
				const newCamera: Camera = {
					center: {
						latitude,
						longitude,
					},
					zoom: 15,
					heading: 0,
					pitch: 0,
					altitude: 1000,
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

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					height: Dimensions.get('window').height * 0.4,
					width: Dimensions.get('window').width,
					elevation: 5,
					backgroundColor: 'white',
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.5,
					shadowRadius: 4,
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
					{markers.map((marker) => (
						<MarkerComponent
							key={marker.id}
							id={marker.id}
							importance={marker.importance}
							coordinates={marker.coordinates}
						/>
					))}
					{Platform.OS === 'web' ? <CurrentPositionMarker /> : null}
				</MapView>
				<CenterStopsButton onPress={async () => await centerStopsCamera()} />
				<CenterCoordinatesButton
					onPress={async () => await centerCoordinatesButtonAction()}
				/>
			</View>
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<View
					style={{
						flexDirection: 'row',
						paddingVertical: 15,
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
						paddingHorizontal: 15,
						height: 70,
						gap: 10,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							flex: 1,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								Platform.OS !== 'web'
									? router.back()
									: router.push({
											pathname: '/route/[cityId]',
											params: { cityId: cityId as string },
									  });
								setMarkerSelected(null);
							}}
						>
							<View
								style={{
									marginRight: 20,
									width: '100%',
									height: '100%',
									justifyContent: 'center',
								}}
							>
								<Image
									source={require('@/assets/images/media_bubble_back.png')}
									style={{ width: 6 }}
									resizeMode="contain"
								/>
							</View>
						</TouchableOpacity>
						<View
							style={{
								flex: 1,
							}}
						>
							<Text
								style={{
									color: '#032000',
									fontFamily: 'Montserrat-Regular',
									fontSize: 16,
								}}
								numberOfLines={2}
							>
								{route?.title}
							</Text>
						</View>
					</View>
					<View
						style={{
							justifyContent: 'space-between',
							alignItems: 'center',
							flexDirection: 'row',
							height: 20,
							gap: 5,
						}}
					>
						<RateRouteButton
							routeId={routeId as string}
							routeTitle={route?.title}
							routeAlreadyRated={route?.userReviewId ? true : false}
						/>
						{route?.rating && <RatingPill number={route.rating || 0} />}
					</View>
				</View>
				<TextSearch setTextSearch={setTextSearch} textSearch={textSearch} />

				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					style={{
						paddingTop: 5,
						width: '100%',
						marginBottom: 20,
						marginTop: 10,
						paddingHorizontal: 12,
						backgroundColor: 'white',
						height: '100%',
						flex: 1,
					}}
					showsVerticalScrollIndicator={false}
					ref={scrollViewRef}
				>
					{stopsFromRoute?.map((stopFromRoute, index) => (
						<StopFromRoutePill
							key={`${stopFromRoute.place.id}_${index}`}
							{...stopFromRoute}
							stopsFromRoute={stopsFromRoute}
							setStopsFromRoute={setStopsFromRoute}
						/>
					))}
					<View style={{ height: 40, width: '100%' }} />
				</ScrollView>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
					colors={['rgba(0,0,0,0.2)', 'transparent']}
					style={{
						position: 'absolute',
						height: 10,
						left: 0,
						right: 0,
					}}
				/>
			</View>
			{loading && (
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
