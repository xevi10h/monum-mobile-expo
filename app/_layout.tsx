import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import 'react-native-reanimated';
import client from '@/graphql/connection';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserStore } from '@/zustand/UserStore';
import { ApolloProvider } from '@apollo/client';
import { useMainStore } from '@/zustand/MainStore';
import { useTabMapStore } from '@/zustand/TabMapStore';
import AuthServices from '@/services/auth/AuthServices';
import MapServices from '@/services/map/MapServices';
import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService, setupPlayerService } from '@/track-player/service';
import DownloadBanner from '@/components/banners/DownloadBanner';
import * as Device from 'expo-device';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded, error] = useFonts({
		'Montserrat-Regular': require('@/assets/fonts/Montserrat-Regular.ttf'),
		'Montserrat-SemiBold': require('@/assets/fonts/Montserrat-SemiBold.ttf'),
	});
	const [allLoaded, setAllLoaded] = useState(false);

	const [isLoading, setIsLoading] = useState(true);
	const [statusBackgroundPermissions, requestStatusBackgroundPermissions] =
		Location.useBackgroundPermissions();
	const [statusForegroundPermissions, requestStatusForegroundPermissions] =
		Location.useForegroundPermissions();

	const hasInitByUrl = useMainStore((state) => state.main.hasInitByUrl);
	const setHasInitByUrl = useMainStore((state) => state.setHasInitByUrl);
	const setMarkerSelected = useTabMapStore((state) => state.setMarkerSelected);
	const setPlace = useTabMapStore((state) => state.setPlace);
	const setShowPlaceDetailExpanded = useTabMapStore(
		(state) => state.setShowPlaceDetailExpanded,
	);
	const setMediasOfPlace = useTabMapStore((state) => state.setMediasOfPlace);
	const setUser = useUserStore((state) => state.setUser);
	const setMarkers = useTabMapStore((state) => state.setMarkers);
	const setMapCameraCoordinates = useTabMapStore(
		(state) => state.setMapCameraCoordinates,
	);
	const setCurrentUserLocation = useMainStore(
		(state) => state.setCurrentUserLocation,
	);
	const startWatchingLocation = useMainStore(
		(state) => state.startWatchingLocation,
	);
	const currentUserLocation = useMainStore(
		(state) => state.main.currentUserLocation,
	);
	const setForceUpdateMapCamera = useTabMapStore(
		(state) => state.setForceUpdateMapCamera,
	);
	const user = useUserStore((state) => state.user);
	const setActiveTab = useMainStore((state) => state.setActiveTab);
	const setPitch = useTabMapStore((state) => state.setPitch);
	const setLanguage = useUserStore((state) => state.setLanguage);

	useEffect(() => {
		async function handleOpenURL(url: string, isFromOutsideApp = false) {
			try {
				const [, placeId] = url.match(/place\/([^?]+)/) || [];
				console.log('placeId', placeId);
				if (placeId) {
					setHasInitByUrl(true);
					setPitch(60);
					if (!user.token) {
						const guestUser = await AuthServices.loginAsGuest();
						setUser(guestUser);
					}
					const markersData = await MapServices.getMarkers(
						'',
						[0, 0],
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
							selected: marker.id === placeId,
						})),
					);
					setActiveTab('Map');
					const fromSupport = isFromOutsideApp
						? 'outsideQRAppClosed'
						: 'outsideQRAppRunning';
					const placeData = await MapServices.getPlaceInfo(
						placeId,
						fromSupport,
					);
					setMarkerSelected(placeId);
					setPlace(placeData);
					const mediasFetched = await MapServices.getPlaceMedia(placeId);
					setMediasOfPlace(mediasFetched);
					setShowPlaceDetailExpanded(false);
					setForceUpdateMapCamera(true);
				}
			} catch (e) {
				console.log('error', e);
			}
		}

		const initializeApp = async () => {
			try {
				if (
					Device.deviceType !== Device.DeviceType.PHONE &&
					Platform.OS === 'web'
				) {
					window.location.href = 'https://monum.es';
				}

				if (
					statusBackgroundPermissions?.canAskAgain &&
					!statusBackgroundPermissions?.granted
				) {
					await requestStatusBackgroundPermissions();
				}
				if (
					statusForegroundPermissions?.canAskAgain &&
					!statusForegroundPermissions?.granted
				) {
					await requestStatusForegroundPermissions();
				}

				let initialURL = await Linking.getInitialURL();
				console.log('initialURL', initialURL);
				if (initialURL) {
					await handleOpenURL(initialURL);
				}
			} catch (error) {
				console.log('Error initializing app:', error);
			}
			setAllLoaded(true);

			Linking.addEventListener('url', async (link) => {
				await handleOpenURL(link.url);
			});

			return () => {
				Linking.removeAllListeners('url');
			};
		};
		initializeApp();
	}, []);

	useEffect(() => {
		async function prepareTrackPlayer() {
			try {
				await setupPlayerService();
			} catch (e) {
				console.error('Error al preparar el reproductor de música', e);
			}
		}
		prepareTrackPlayer();
	}, []);

	useEffect(() => {
		async function prepareWhenAuthenticated() {
			try {
				setLanguage(user.language || 'ca_ES');
				let userLocation = currentUserLocation;
				if (
					statusBackgroundPermissions?.canAskAgain &&
					!statusBackgroundPermissions?.granted
				) {
					console.log('Requesting background permissions');
					await requestStatusBackgroundPermissions();
				}
				if (
					statusForegroundPermissions?.canAskAgain &&
					!statusForegroundPermissions?.granted
				) {
					console.log('Requesting foreground permissions');
					await requestStatusForegroundPermissions();
				}
				if (!userLocation) {
					console.log('Getting user location');
					const position: any = await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.Highest,
						timeInterval: 5000,
						distanceInterval: 1,
					});

					const longitude = position.coords.longitude;
					const latitude = position.coords.latitude;
					userLocation = [longitude, latitude];
					setCurrentUserLocation(userLocation);
				}

				if (user.token && !hasInitByUrl) {
					setMapCameraCoordinates(userLocation);
					setForceUpdateMapCamera(true);
				}
			} catch (error) {
				console.error('Error obtaining geolocation:', error);
				setCurrentUserLocation(null);
			}
		}
		if (user.token) {
			prepareWhenAuthenticated();
		}
	}, [user.token]);

	useEffect(() => {
		startWatchingLocation();
	}, [startWatchingLocation]);

	useEffect(() => {
		console.log('user', user);
		if ((loaded || error) && allLoaded && isLoading) {
			user.token ? router.replace('/(main)/(map)') : router.replace('/(auth)');
		}
	}, [loaded, isLoading, error, allLoaded, user.token]);

	useEffect(() => {
		async function initializeApp() {}
		if (loaded) {
			initializeApp();
		}
	}, [loaded]);

	useEffect(() => {
		if (loaded || error) {
			TrackPlayer.registerPlaybackService(() => PlaybackService);
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<ApolloProvider client={client}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<GestureHandlerRootView>
					<ActionSheetProvider>
						<>
							<DownloadBanner />
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name="(auth)" options={{ headerShown: false }} />
								<Stack.Screen name="(main)" options={{ headerShown: false }} />
							</Stack>
						</>
					</ActionSheetProvider>
				</GestureHandlerRootView>
			</ThemeProvider>
		</ApolloProvider>
	);
}
