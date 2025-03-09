import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import client from '@/graphql/connection';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserStore } from '@/zustand/UserStore';
import { ApolloProvider } from '@apollo/client';
import { useMainStore } from '@/zustand/MainStore';
import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService, setupPlayerService } from '@/track-player/service';
import DownloadBanner from '@/components/banners/DownloadBanner';
import * as Device from 'expo-device';
import * as Orientation from 'expo-screen-orientation';
import { useLocationStore } from '@/zustand/LocationStore';
import { LOCATION_TASK_NAME } from '@/tasks/LocationTask';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded, error] = useFonts({
		'Montserrat-Regular': require('@/assets/fonts/Montserrat-Regular.ttf'),
		'Montserrat-SemiBold': require('@/assets/fonts/Montserrat-SemiBold.ttf'),
	});
	const [allLoaded, setAllLoaded] = useState(false);

	const [statusBackgroundPermissions, requestStatusBackgroundPermissions] =
		Location.useBackgroundPermissions();
	const [statusForegroundPermissions, requestStatusForegroundPermissions] =
		Location.useForegroundPermissions();
	const videoPlayer = useMainStore((state) => state.main.videoPlayer);
	const user = useUserStore((state) => state.user);
	const setLanguage = useUserStore((state) => state.setLanguage);

	const setCoords = useLocationStore((state) => state.setCoords);
	const setPermissionStatus = useLocationStore(
		(state) => state.setPermissionStatus,
	);
	const isBackgroundLocationEnabled = useLocationStore(
		(state) => state.isBackgroundLocationEnabled,
	);
	const setBackgroundLocationEnabled = useLocationStore(
		(state) => state.setBackgroundLocationEnabled,
	);
	const permissionStatus = useLocationStore((state) => state.permissionStatus);

	useEffect(() => {
		(async () => {
			let foregroundPermission =
				await Location.requestForegroundPermissionsAsync();
			if (foregroundPermission.status === 'granted') {
				setPermissionStatus(foregroundPermission.status);
			} else {
				console.log('Permiso de ubicación en primer plano denegado');
				return;
			}

			let backgroundPermission =
				await Location.requestBackgroundPermissionsAsync();
			if (backgroundPermission.status === 'granted') {
				setBackgroundLocationEnabled(true);
			} else {
				console.log('Permiso de ubicación en segundo plano denegado');
			}
		})();
	}, []);

	useEffect(() => {
		let locationWatcher: Location.LocationSubscription | null = null;
		if (permissionStatus === 'granted') {
			(async () => {
				locationWatcher = await Location.watchPositionAsync(
					{
						accuracy: Location.Accuracy.BestForNavigation,
						timeInterval: 1000,
						distanceInterval: 1,
					},
					(location) => {
						setCoords(location.coords);
					},
				);
			})();
		}

		return () => {
			if (locationWatcher) {
				locationWatcher.remove();
			}
		};
	}, [permissionStatus, setCoords]);

	// Background location tracking (web is not supported)
	useEffect(() => {
		const startBackgroundLocation = async () => {
			if (
				Platform.OS !== 'web' &&
				permissionStatus === 'granted' &&
				isBackgroundLocationEnabled
			) {
				try {
					await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
						accuracy: Location.Accuracy.BestForNavigation,
						timeInterval: 30000,
						distanceInterval: 10,
						foregroundService: {
							notificationTitle: 'Ubicación en segundo plano activa',
							notificationBody:
								'Rastreo de ubicación en segundo plano activado',
							killServiceOnDestroy: false,
						},
					});
				} catch (error: any) {
					console.error('Error al iniciar el rastreo en segundo plano:', error);
				}
			}
		};

		startBackgroundLocation();

		if (Platform.OS !== 'web') {
			return () => {
				Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
			};
		}
	}, [permissionStatus, isBackgroundLocationEnabled]);

	useEffect(() => {
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
			} catch (error) {
				console.log('Error initializing app:', error);
			}
			setAllLoaded(true);

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
		async function screenOrientationLock() {
			if (videoPlayer) {
				await Orientation.unlockAsync();
			} else {
				await Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT_UP);
			}
		}
		if (Platform.OS !== 'web') screenOrientationLock();
	}, [videoPlayer]);

	useEffect(() => {
		async function prepareWhenAuthenticated() {
			try {
				setLanguage(user.language || 'ca_ES');
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
			} catch (error) {
				console.error('Error obtaining geolocation:', error);
			}
		}
		if (user?.token) {
			prepareWhenAuthenticated();
		}
	}, [user.token]);

	useEffect(() => {
		if ((loaded || error) && allLoaded) {
			user?.token ? router.replace('/(main)/place') : router.replace('/(auth)');
		}
	}, [loaded, error, allLoaded, user.token]);

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
