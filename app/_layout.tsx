import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import 'react-native-reanimated';
import client from '@/graphql/connection';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserStore } from '@/zustand/UserStore';
import { ApolloProvider } from '@apollo/client';
import { useMainStore } from '@/zustand/MainStore';
import { useTabMapStore } from '@/zustand/TabMapStore';
import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService, setupPlayerService } from '@/track-player/service';
import DownloadBanner from '@/components/banners/DownloadBanner';
import * as Device from 'expo-device';
import * as Orientation from 'expo-screen-orientation';

// Prevent the splash screen from auto-hiding before asset loading is complete.
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

	const setCurrentUserLocation = useMainStore(
		(state) => state.setCurrentUserLocation,
	);
	const startWatchingLocation = useMainStore(
		(state) => state.startWatchingLocation,
	);
	const videoPlayer = useMainStore((state) => state.main.videoPlayer);
	const currentUserLocation = useMainStore(
		(state) => state.main.currentUserLocation,
	);
	const user = useUserStore((state) => state.user);
	const setLanguage = useUserStore((state) => state.setLanguage);

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
			} catch (error) {
				console.error('Error obtaining geolocation:', error);
				setCurrentUserLocation(null);
			}
		}
		if (user?.token) {
			prepareWhenAuthenticated();
		}
	}, [user.token]);

	useEffect(() => {
		startWatchingLocation();
	}, [startWatchingLocation]);

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
