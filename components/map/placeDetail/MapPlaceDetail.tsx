/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import {
	Gesture,
	GestureDetector,
	GestureUpdateEvent,
	PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MapPlaceDetailExpanded from './MapPlaceDetailExpanded';
import MapPlaceDetailReduced from './MapPlaceDetailReduced';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useUserStore } from '@/zustand/UserStore';
import { router } from 'expo-router';

const { height } = Dimensions.get('screen');

export const BOTTOM_TAB_HEIGHT = Platform.OS === 'android' ? 150 : 140;

export default function MapPlaceDetail() {
	const MAX_MARGIN_TOP = Platform.OS === 'web' ? 160 : useSafeAreaInsets().top;
	const markerSelected = useTabMapStore((state) => state.tabMap.markerSelected);
	const setMarkerSelected = useTabMapStore((state) => state.setMarkerSelected);
	const place = useTabMapStore((state) => state.tabMap.place);
	const showPlaceDetailExpanded = useTabMapStore(
		(state) => state.tabMap.showPlaceDetailExpanded,
	);
	const setShowPlaceDetailExpanded = useTabMapStore(
		(state) => state.setShowPlaceDetailExpanded,
	);
	const mediasOfPlace = useTabMapStore((state) => state.tabMap.mediasOfPlace);

	const language = useUserStore((state) => state.user.language);

	const BOTTOM_TOTAL_TAB_HEIGHT = 230;

	const position = useSharedValue(0);

	const importanceIcon = () => {
		switch (place?.importance) {
			case 1:
				return require('@/assets/images/place_pre_detail_importance_1.png');
			case 2:
				return require('@/assets/images/place_pre_detail_importance_2.png');
			case 3:
				return require('@/assets/images/place_pre_detail_importance_3.png');
			default:
				return require('@/assets/images/place_pre_detail_importance_1.png');
		}
	};

	const closePlaceDetail = () => {
		position.value = withTiming(0, { duration: 300 }, () => {
			runOnJS(setMarkerSelected)(null);
			runOnJS(setShowPlaceDetailExpanded)(false);
			runOnJS(router.push)({
				pathname: `/(main)/place`,
				params: { placeId: null },
			});
		});
	};

	const panGestureEvent = Gesture.Pan()
		.onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
			const newPosition = height - event.translationY;
			if (!showPlaceDetailExpanded) {
				if (newPosition >= BOTTOM_TOTAL_TAB_HEIGHT) {
					position.value = BOTTOM_TOTAL_TAB_HEIGHT;
				} else {
					position.value = newPosition;
				}
			} else {
				if (newPosition >= height - MAX_MARGIN_TOP) {
					position.value = height - MAX_MARGIN_TOP;
				} else {
					position.value = newPosition;
				}
			}
		})
		.onEnd((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
			if (!showPlaceDetailExpanded) {
				if (
					height - event.translationY <
						height - BOTTOM_TOTAL_TAB_HEIGHT / 2 + 80 ||
					event.velocityY > 0
				) {
					runOnJS(closePlaceDetail)();
				} else {
					position.value = withTiming(BOTTOM_TOTAL_TAB_HEIGHT);
				}
			} else {
				if (position.value < height / 2 || event.velocityY > 0) {
					runOnJS(closePlaceDetail)();
				} else {
					position.value = withTiming(height - MAX_MARGIN_TOP);
				}
			}
		});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			bottom: 0,
			height: position.value,
		};
	});

	useEffect(() => {
		if (markerSelected) {
			const fetchPlace = async () => {
				position.value = withTiming(BOTTOM_TOTAL_TAB_HEIGHT, {
					duration: 300,
				});
			};
			fetchPlace();
		}
	}, [markerSelected]);

	useEffect(() => {
		if (place && showPlaceDetailExpanded) {
			position.value = withTiming(height - MAX_MARGIN_TOP, { duration: 300 });
		}
	}, [showPlaceDetailExpanded, place]);

	return markerSelected ? (
		<View
			style={[
				styles.container,
				{
					bottom: -80,
					backgroundColor: showPlaceDetailExpanded
						? 'rgba(0, 0, 0, 0.8)'
						: 'transparent',
					// top: height - BOTTOM_TAB_HEIGHT - 80,
					top: showPlaceDetailExpanded ? 0 : undefined,
				},
			]}
		>
			<GestureDetector gesture={panGestureEvent}>
				<Animated.View style={[styles.animatedContainer, animatedStyle]}>
					{showPlaceDetailExpanded && place && Array.isArray(mediasOfPlace) ? (
						<MapPlaceDetailExpanded
							importanceIcon={importanceIcon()}
							closePlaceDetail={closePlaceDetail}
						/>
					) : (
						<MapPlaceDetailReduced importanceIcon={importanceIcon()} />
					)}
				</Animated.View>
			</GestureDetector>
		</View>
	) : null;
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: '100%',
		zIndex: 10,
	},
	animatedContainer: {
		position: 'absolute',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 10,
		width: '100%',
		backgroundColor: 'white',
	},
});
