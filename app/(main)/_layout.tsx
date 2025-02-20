import { StyleSheet, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, {
	Event,
	useTrackPlayerEvents,
} from 'react-native-track-player';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useMainStore } from '@/zustand/MainStore';
import VideoPlayer from '@/components/video/VideoPlayer';
import { Tabs } from 'expo-router';
import MediaComponent from '@/components/media/MediaComponent';
import ReviewModal from '@/components/modals/ReviewModal';

export const BOTTOM_TAB_NAVIGATOR_HEIGHT = 70;

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
	const bottomSafeArea = useSafeAreaInsets().bottom;
	const setStatePlayer = useMainStore((state) => state.setStatePlayer);
	const currentTrack = useMainStore((state) => state.main.currentTrack);
	const setCurrentTrack = useMainStore((state) => state.setCurrentTrack);
	const setCurrentTrackIndex = useMainStore(
		(state) => state.setCurrentTrackIndex,
	);
	const videoPlayer = useMainStore((state) => state.main.videoPlayer);
	const reviewModal = useMainStore((state) => state.main.reviewModal);

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

	return (
		<>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle="dark-content"
			/>
			<Tabs
				initialRouteName="place"
				screenOptions={({ route }) => ({
					tabBarStyle: [
						styles.map,
						{
							height: bottomSafeArea + BOTTOM_TAB_NAVIGATOR_HEIGHT,
							flexDirection: 'row',
							alignItems: 'center',
							elevation: 0,
						},
					],
					headerShown: false,
					tabBarShowLabel: false,
					tabBarButton: (props: any) => (
						<TouchableWithoutFeedback
							{...props}
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								height: BOTTOM_TAB_NAVIGATOR_HEIGHT,
							}}
						/>
					),
					tabBarIcon: ({ focused, color }) => {
						if (route.name === 'route') {
							return (
								<Image
									source={require('@/assets/images/bottom_bar_list_inactive.png')}
									style={{
										tintColor: focused ? '#3F713B' : color,
										height: 32,
										width: 32,
									}}
									resizeMode="contain"
								/>
							);
						}
						if (route.name === 'place') {
							return (
								<Image
									source={require('@/assets/images/bottom_bar_map_inactive.png')}
									style={{
										tintColor: focused ? '#3F713B' : color,
										height: 32,
										width: 32,
									}}
									resizeMode="contain"
								/>
							);
						}
						if (route.name === 'profile') {
							return (
								<Image
									source={require('@/assets/images/bottom_bar_config_inactive.png')}
									style={{
										tintColor: focused ? '#3F713B' : color,
										height: 32,
										width: 32,
									}}
									resizeMode="contain"
								/>
							);
						}
					},
				})}
			>
				<Tabs.Screen
					name="route"
					options={{ headerPressOpacity: 1, headerPressColor: 'transparent' }}
				/>
				<Tabs.Screen
					name="place"
					options={{ headerPressOpacity: 1, headerPressColor: 'transparent' }}
				/>
				<Tabs.Screen
					name="profile"
					options={{ headerPressOpacity: 1, headerPressColor: 'transparent' }}
				/>
			</Tabs>
			{currentTrack && <MediaComponent />}
			{videoPlayer && <VideoPlayer />}
			{reviewModal && <ReviewModal />}
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
