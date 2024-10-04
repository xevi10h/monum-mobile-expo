/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
	Dimensions,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	Gesture,
	GestureDetector,
	GestureUpdateEvent,
	PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import { PaginationItem } from '../PaginationItem';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useMainStore } from '@/zustand/MainStore';
import MediaExpandedText from './MediaExpandedExtension';
import MediaPlayer from './MediaPlayer';

const { height } = Dimensions.get('window');
const extensionHeight = height * 0.65 + 160;
type GestureContext = {
	startY: number;
};

export default function MediaExpanded() {
	const placeOfMedia = useMainStore((state) => state.main.placeOfMedia);
	const setExpandedMediaDetail = useTabMapStore(
		(state) => state.setExpandedMediaDetail,
	);
	const topSafeAreaInsets = useSafeAreaInsets().top;
	const position = useSharedValue(height);
	const progressValue = useSharedValue<number>(0);
	const currentTrack = useMainStore((state) => state.main.currentTrack);

	const [isFullExtended, setIsFullExtended] = useState(false);
	const [isMain, setIsMain] = useState(true);

	const panGesture = Gesture.Pan()
		// .onStart((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
		// 	event.y = position.value;
		// })
		.onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
			const newPosition = event.translationY;
			console.log(newPosition);
			position.value = newPosition;
			if (position.value <= -extensionHeight) {
				runOnJS(setIsFullExtended)(true);
			} else {
				runOnJS(setIsFullExtended)(false);
			}
		})
		.onEnd((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
			console.log('end', event.velocityY);
			if (
				(position.value > height / 2 || event.velocityY > 0) &&
				isMain === true
			) {
				position.value = withTiming(
					height,
					{
						duration: 300,
					},
					() => runOnJS(setExpandedMediaDetail)(false),
				);
			} else if (position.value < 0 && event.velocityY < 0) {
				position.value = withTiming(-extensionHeight, { duration: 300 }, () => {
					runOnJS(setIsFullExtended)(true);
					runOnJS(setIsMain)(false);
				});
			} else {
				position.value = withTiming(0, { duration: 300 }, () => {
					runOnJS(setIsFullExtended)(false);
					runOnJS(setIsMain)(true);
				});
			}
		});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			marginTop: position.value,
		};
	});

	useEffect(() => {
		if (currentTrack?.mediaType === 'text') {
			setIsFullExtended(true);
			position.value = withTiming(-extensionHeight, { duration: 300 }, () => {
				runOnJS(setIsMain)(false);
			});
		} else {
			position.value = withTiming(0, { duration: 300 });
		}
	}, [currentTrack]);

	const width = Dimensions.get('window').width;
	const imagesUrl = placeOfMedia?.imagesUrl || [];

	const closeMediaDetail = () => {
		position.value = withTiming(
			height,
			{
				duration: 300,
			},
			() => runOnJS(setExpandedMediaDetail)(false),
		);
	};

	return (
		<View style={styles.container}>
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[styles.animatedContainer, animatedStyle]}>
					<View style={{ flex: 1 }}>
						<View style={{ height: height * 0.65 }}>
							<Carousel
								loop
								width={width}
								data={imagesUrl}
								scrollAnimationDuration={500}
								onProgressChange={(_, absoluteProgress) =>
									(progressValue.value = absoluteProgress)
								}
								renderItem={({ index }) => (
									<View style={styles.imageContainer}>
										<Image
											source={{
												uri: imagesUrl[index],
											}}
											resizeMode="cover"
											style={styles.image}
										/>
									</View>
								)}
							/>
						</View>
						{!!progressValue && (
							<View
								style={{
									position: 'absolute',
									top: height * 0.65 - 20,
									flexDirection: 'row',
									justifyContent: 'space-between',
									width: 100,
									alignSelf: 'center',
								}}
							>
								{imagesUrl.map((_, index) => {
									return (
										<PaginationItem
											animValue={progressValue}
											index={index}
											key={index}
											length={imagesUrl.length}
										/>
									);
								})}
							</View>
						)}
						<Pressable style={styles.arrowContainer} onPress={closeMediaDetail}>
							<LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 0, y: 1 }}
								colors={['rgba(3, 32, 0, 1)', 'rgba(3, 32, 0, 0)']}
								style={styles.linearGradient}
							/>
							<Image
								source={require('@/assets/images/place_detail_arrow_bottom_white.png')}
								style={[styles.arrowIcon, { top: 10 + topSafeAreaInsets }]}
								resizeMode="contain"
							/>
						</Pressable>
						{currentTrack?.rating ? (
							<View style={styles.mediaPillRatingContainer}>
								<Text style={styles.mediaPillRating}>
									{`${currentTrack?.rating?.toFixed(1)}`}
								</Text>
								<View>
									<Image
										source={require('@/assets/images/place_detail_media_rating_star.png')}
										style={{ width: 10, height: 10 }}
										resizeMode="contain"
									/>
								</View>
							</View>
						) : (
							<View
								style={{
									marginTop: -13,
									height: 26,
								}}
							/>
						)}
						<View style={{ paddingHorizontal: 12 }}>
							<MediaPlayer />
						</View>
						<MediaExpandedText
							position={position}
							isFullExtended={isFullExtended}
							setIsFullExtended={setIsFullExtended}
							extensionHeight={extensionHeight}
							setIsMain={setIsMain}
						/>
					</View>
				</Animated.View>
			</GestureDetector>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		top: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flex: 1,
	},
	animatedContainer: {
		backgroundColor: 'white',
		flex: 1,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 10,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	imageContainer: {
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	image: {
		width: '100%',
		height: '100%',
		paddingBottom: 13,
	},
	arrowContainer: {
		position: 'absolute',
		top: 0,
		width: '100%',
		height: 100,
		alignItems: 'center',
		justifyContent: 'center',
	},
	linearGradient: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	arrowIcon: {
		position: 'absolute',
		height: 30,
		width: 30,
	},
	mediaPillRatingContainer: {
		marginLeft: 12,
		marginTop: -13,
		height: 26,
		width: 44,
		backgroundColor: '#3F713B',
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		borderColor: 'white',
		borderWidth: 1,
	},
	mediaPillRating: {
		fontSize: 14,
		color: 'white',
	},
});
