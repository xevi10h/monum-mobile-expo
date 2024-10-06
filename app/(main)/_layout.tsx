import * as Orientation from 'expo-screen-orientation';
import { NavigationContainerRef } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, {
	Event,
	useTrackPlayerEvents,
} from 'react-native-track-player';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useMainStore } from '@/zustand/MainStore';
import VideoPlayer from '@/components/video/VideoPlayer';
import { Tabs } from 'expo-router';
import MediaComponent from '@/components/media/MediaComponent';

export const BOTTOM_TAB_NAVIGATOR_HEIGHT = Platform.OS === 'android' ? 70 : 60;

// Define un tipo para las rutas
export type RootBottomTabList = {
	Routes: undefined;
	Map: undefined;
	Profile: undefined;
};

// Define un tipo para los Bottom Tab Icons
export type BottomTabBarIconProps = {
	focused: boolean;
	name?: string;
};

function BottomTabNavigator() {
	const navigationRef = useRef<NavigationContainerRef<RootBottomTabList>>(null);
	const bottomSafeArea = useSafeAreaInsets().bottom;
	const activeTab = useMainStore((state) => state.main.activeTab);
	const setActiveTab = useMainStore((state) => state.setActiveTab);
	const setStatePlayer = useMainStore((state) => state.setStatePlayer);
	const currentTrack = useMainStore((state) => state.main.currentTrack);
	const setCurrentTrack = useMainStore((state) => state.setCurrentTrack);
	const setCurrentTrackIndex = useMainStore(
		(state) => state.setCurrentTrackIndex,
	);

	useTrackPlayerEvents([Event.PlaybackState], async (event) => {
		setStatePlayer(event.state);
	});

	useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
		if (
			event.type === Event.PlaybackActiveTrackChanged &&
			event.track !== null
		) {
			try {
				const track = await TrackPlayer.getActiveTrack();
				const index = await TrackPlayer.getActiveTrackIndex();

				if (track !== null && index !== null) {
					setCurrentTrack(track);
					setCurrentTrackIndex(index);
				}
			} catch (e) {
				console.log(e);
			}
		}
	});

	const videoPlayer = useMainStore((state) => state.main.videoPlayer);

	useEffect(() => {
		if (navigationRef.current) {
			if (
				activeTab === 'Routes' ||
				activeTab === 'Map' ||
				activeTab === 'Profile'
			) {
				navigationRef.current.navigate(activeTab);
			}
		}
	}, [activeTab]);

	const renderTabBarIcon = ({ focused, name }: BottomTabBarIconProps) => {
		let source;
		switch (name) {
			case 'Routes':
				source = require('@/assets/images/bottom_bar_list_inactive.png');
				break;
			case 'Map':
				source = require('@/assets/images/bottom_bar_map_inactive.png');
				break;
			case 'Profile':
				source = require('@/assets/images/bottom_bar_config_inactive.png');
				break;
			default:
				source = require('@/assets/images/bottom_bar_config_inactive.png');
				break;
		}
		return (
			<Image
				source={source}
				style={[
					styles.bottom_bar_logo_image,
					{
						tintColor: focused ? '#3F713B' : '#BDBDBD',
					},
				]}
				resizeMode="contain"
			/>
		);
	};

	useEffect(() => {
		async function screenOrientationLock() {
			if (videoPlayer) {
				await Orientation.unlockAsync();
			} else {
				await Orientation.lockAsync(Orientation.OrientationLock.DEFAULT);
			}
		}
		if (Platform.OS !== 'web') screenOrientationLock();
	}, [videoPlayer]);

	return (
		<>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle="dark-content"
			/>
			<Tabs
				screenOptions={{
					tabBarStyle: [
						styles.map,
						{
							height: bottomSafeArea + BOTTOM_TAB_NAVIGATOR_HEIGHT,
						},
					],
					tabBarShowLabel: false,
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name="(routes)"
					listeners={{
						focus: () => setActiveTab('Routes'),
					}}
					options={{
						tabBarIcon: ({ focused }) =>
							renderTabBarIcon({ focused, name: 'Routes' }),
					}}
				/>

				<Tabs.Screen
					name="(map)"
					listeners={{
						focus: () => setActiveTab('Map'),
					}}
					options={{
						tabBarIcon: ({ focused }) =>
							renderTabBarIcon({ focused, name: 'Map' }),
						tabBarStyle: [
							styles.map,
							{
								display: 'flex',
								height: bottomSafeArea + BOTTOM_TAB_NAVIGATOR_HEIGHT,
							},
						],
					}}
				/>

				<Tabs.Screen
					name="(profile)"
					listeners={{
						focus: () => setActiveTab('Profile'),
					}}
					options={{
						tabBarIcon: ({ focused }) =>
							renderTabBarIcon({ focused, name: 'Profile' }),
					}}
				/>
			</Tabs>
			{currentTrack && <MediaComponent />}
			{videoPlayer && <VideoPlayer />}
		</>
	);
}

const styles = StyleSheet.create({
	bottom_bar_logo_image: {
		width: 30,
		height: 30,
	},
	map: {
		backgroundColor: 'white',
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 10,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		justifyContent: 'flex-start',
		marginTop: -30,
	},
});

export default BottomTabNavigator;
