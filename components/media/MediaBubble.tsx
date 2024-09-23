/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Slider } from '@rneui/themed';
import Animated, {
	runOnJS,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useMainStore } from '@/zustand/MainStore';
import CarouselText from '@/components/CarouselText';

const BOTTOM_TAB_NAVIGATOR_HEIGHT = Platform.OS === 'android' ? 70 : 56;
const { width } = Dimensions.get('window');

type GestureContext = {
	startY: number;
	startX: number;
};

export default function MediaBubble() {
	const progress = useProgress();
	const currentTrackIndex = useMainStore(
		(state) => state.main.currentTrackIndex,
	);
	const currentTrack = useMainStore((state) => state.main.currentTrack);
	const statePlayer = useMainStore((state) => state.main.statePlayer);
	const placeOfMedia = useMainStore((state) => state.main.placeOfMedia);
	const imagesUrl = placeOfMedia?.imagesUrl || [];
	const setExpandedMediaDetail = useTabMapStore(
		(state) => state.setExpandedMediaDetail,
	);
	const bottomSafeAreaInsets = useSafeAreaInsets().bottom;
	const [closeBubble, setCloseBubble] = useState(false);

	const position = useSharedValue(width / 2);
	const panGestureEvent = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		GestureContext
	>({
		onStart: (_, context) => {
			context.startX = position.value;
		},
		onActive: (event, context) => {
			const newPosition = context.startX + event.translationX;
			position.value = newPosition;
		},
		onEnd: (event) => {
			const diference = position.value - width / 2;
			if (diference > 15 && event.velocityX > 0) {
				position.value = withTiming(
					width * 2,
					{ duration: width * 2 - position.value },
					() => {
						runOnJS(setCloseBubble)(true);
					},
				);
			} else if (-diference > 15 && event.velocityX < 0) {
				position.value = withTiming(
					-width,
					{ duration: position.value + width },
					() => {
						runOnJS(setCloseBubble)(true);
					},
				);
			} else {
				position.value = withTiming(width / 2);
			}
		},
	});
	const animatedStyle = useAnimatedStyle(() => {
		const diference = position.value - width / 2;
		return {
			left: 15 + diference,
			right: 15 - diference,
		};
	});

	useEffect(() => {
		position.value = withTiming(width / 2, {
			duration: 300,
		});
	}, []);

	useEffect(() => {
		async function closePlayer() {
			try {
				await TrackPlayer.reset();
				setCloseBubble(true);
			} catch (e) {
				console.log(e);
			}
		}
		closeBubble && closePlayer();
	}, [closeBubble]);

	return (
		<PanGestureHandler onGestureEvent={panGestureEvent}>
			<Animated.View
				style={[
					styles.animatedContainer,
					animatedStyle,
					{
						bottom: bottomSafeAreaInsets + BOTTOM_TAB_NAVIGATOR_HEIGHT + 5,
					},
				]}
			>
				<TouchableWithoutFeedback onPress={() => setExpandedMediaDetail(true)}>
					<View style={styles.mediaBubbleContainer}>
						<View style={styles.mediaBubbleImageContainer}>
							<Image
								source={{
									uri: Array.isArray(imagesUrl) ? imagesUrl[0] : '',
								}}
								style={styles.mediaBubbleImage}
								resizeMode="cover"
							/>
						</View>
						<View style={styles.mediaBubbleInfoContainer}>
							<View style={styles.mediaBubbleTitleContainer}>
								<CarouselText text={currentTrack?.title || ''} />
							</View>
							<View style={styles.mediaBubbleLocationContainer}>
								<Image
									source={require('@/assets/images/media_bubble_location.png')}
									style={styles.mediaBubbleLocationImage}
									resizeMode="contain"
								/>
								<Text style={styles.mediaBubbleLocationText}>
									{placeOfMedia?.address?.city}
								</Text>
							</View>
						</View>
						<View style={styles.mediaBubblePlayerButtonsContainer}>
							<TouchableOpacity
								style={styles.mediaBubblePlayerButtonsImageContainer}
								onPress={async () => {
									try {
										if (
											currentTrackIndex !== null &&
											currentTrackIndex !== undefined
										) {
											if (currentTrackIndex === 0) {
												await TrackPlayer.seekTo(0);
											} else {
												await TrackPlayer.skipToPrevious();
											}
											const previousTrackIndex = Math.max(
												0,
												currentTrackIndex - 1,
											);
											const previousTrack = await TrackPlayer.getTrack(
												previousTrackIndex,
											);
											previousTrack?.mediaType === 'text'
												? await TrackPlayer.pause()
												: await TrackPlayer.play();
										}
									} catch (e) {
										console.log(e);
									}
								}}
							>
								<Image
									source={require('@/assets/images/media_bubble_back.png')}
									style={styles.mediaBubblePlayerButtonsImage}
									resizeMode="contain"
								/>
							</TouchableOpacity>
							{currentTrack?.mediaType !== 'text' ? (
								<TouchableOpacity
									style={styles.mediaBubblePlayerButtonsImageContainer}
									onPress={async () => {
										try {
											statePlayer === State.Paused
												? await TrackPlayer.play()
												: await TrackPlayer.pause();
										} catch (e) {
											console.log(e);
										}
									}}
								>
									<Image
										source={
											statePlayer === State.Paused
												? require('@/assets/images/media_bubble_play.png')
												: require('@/assets/images/media_bubble_pause.png')
										}
										style={styles.mediaBubblePlayerButtonsImagePlay}
										resizeMode="contain"
									/>
								</TouchableOpacity>
							) : (
								<View style={{ width: 14, height: 14, flex: 1 }} />
							)}
							<TouchableOpacity
								style={styles.mediaBubblePlayerButtonsImageContainer}
								onPress={async () => {
									try {
										if (
											currentTrackIndex !== null &&
											currentTrackIndex !== undefined
										) {
											await TrackPlayer.skipToNext();
											const nextTrack = await TrackPlayer.getTrack(
												currentTrackIndex + 1,
											);
											if (nextTrack) {
												nextTrack.mediaType === 'text'
													? await TrackPlayer.pause()
													: await TrackPlayer.play();
											} else {
												await TrackPlayer.pause();
											}
										}
									} catch (e) {
										console.log(e);
									}
								}}
							>
								<Image
									source={require('@/assets/images/media_bubble_forward.png')}
									style={styles.mediaBubblePlayerButtonsImagePlay}
									resizeMode="contain"
								/>
							</TouchableOpacity>
						</View>

						<View
							style={[
								styles.mediaBubbleSliderContainer,
								{ width: width * 0.65 },
							]}
						>
							<Slider
								onSlidingComplete={(value) => {
									TrackPlayer.seekTo(value * progress.duration);
								}}
								value={
									progress.duration === 0
										? 0
										: progress.position / progress.duration
								}
								style={{
									height: 1,
									display: currentTrack?.mediaType === 'text' ? 'none' : 'flex',
								}}
								minimumValue={0}
								trackStyle={{ height: 2 }}
								thumbStyle={{ height: 6, width: 6 }}
								maximumTrackTintColor="grey"
								minimumTrackTintColor="#032000"
								thumbTintColor="#032000"
							/>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Animated.View>
		</PanGestureHandler>
	);
}

const styles = StyleSheet.create({
	animatedContainer: {
		position: 'absolute',
		borderRadius: 12,
		height: 70,
		backgroundColor: '#CCD8CB',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 10,
	},
	mediaBubbleContainer: {
		width: '100%',
		height: 70,
		borderRadius: 12,
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#CCD8CB',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 10,
	},
	mediaBubbleImageContainer: {
		flex: 40,
		marginRight: 5,
	},
	mediaBubbleImage: { width: 40, height: 40, borderRadius: 12 },
	mediaBubbleInfoContainer: {
		flex: 230,
		height: 17,
		marginHorizontal: 5,
	},
	mediaBubbleTitleContainer: {
		width: '100%',
		height: 17,
		marginBottom: 5,
	},
	mediaBubbleLocationContainer: {
		width: '100%',
		height: 17,
		flexDirection: 'row',
		alignItems: 'center',
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
	},
	mediaBubbleLocationImage: { width: 15, height: 15, marginRight: 5 },
	mediaBubbleLocationText: { color: '#3F713B', fontSize: 14 },
	mediaBubblePlayerButtonsContainer: {
		flexDirection: 'row',
		flex: 80,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 5,
	},
	mediaBubblePlayerButtonsImageContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	mediaBubblePlayerButtonsImage: { width: 10, height: 14 },
	mediaBubblePlayerButtonsImagePlay: { width: 14, height: 14 },
	mediaBubbleSliderContainer: {
		position: 'absolute',
		bottom: 10,
		height: 1,
		left: 10,
	},
});
