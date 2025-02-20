import {
	Image,
	ScrollView,
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Platform,
} from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import RoutePlaceMediaPill from './RoutePlaceMediaPill';
import IMedia from '@/shared/interfaces/IMedia';
import { ImportanceIcon } from './ImportanceIcon';
import { useTranslation } from '@/hooks/useTranslation';
import { getApps } from 'react-native-map-link';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { StopFromRoutePillInterface } from '@/app/(main)/route/[cityId]/[routeId]';
import { useEffect } from 'react';

interface StopFromRoutePillInterfaceExtended
	extends StopFromRoutePillInterface {
	setStopsFromRoute: (stopsFromRoute: StopFromRoutePillInterface[]) => void;
	stopsFromRoute: StopFromRoutePillInterface[];
}

export default function StopFromRoutePill({
	isExpanded,
	isHighlighted,
	place,
	medias,
	setStopsFromRoute,
	stopsFromRoute,
}: StopFromRoutePillInterfaceExtended) {
	const { showActionSheetWithOptions } = useActionSheet();
	const animationValue = useSharedValue(0);
	const { t } = useTranslation();

	useEffect(() => {
		if (isExpanded) {
			animationValue.value = 1;
		}
	}, [isExpanded]);

	useEffect(() => {
		if (isHighlighted) {
			setTimeout(() => {
				setStopsFromRoute(
					stopsFromRoute.map((stop) => {
						if (stop.place.id === place.id) {
							return { ...stop, isHighlighted: false };
						}
						return stop;
					}),
				);
			}, 3000);
		}
	}, [isHighlighted]);

	const toggleExpanded = () => {
		const finalAnimationValue = isExpanded ? 0 : 1;
		animationValue.value = withTiming(finalAnimationValue, {
			duration: 300,
			easing: Easing.bezier(0.5, 0.01, 0, 1),
		});
		setStopsFromRoute(
			stopsFromRoute.map((stop) => {
				if (stop.place.id === place.id) {
					return { ...stop, isExpanded: !isExpanded };
				}
				return stop;
			}),
		);
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: animationValue.value * 150 + 60,
		};
	});

	return (
		<View
			style={[
				{
					width: '100%',
					elevation: 10,
				},
			]}
		>
			<Animated.View
				style={[
					styles.placeMediaPillAnimated,
					Platform.OS !== 'web' ? animatedStyle : {},
					{ backgroundColor: isHighlighted ? '#D6E5D6' : '#ECF3EC' },
				]}
			>
				<View style={{ flex: 1 }}>
					<TouchableOpacity onPress={toggleExpanded}>
						<View
							style={[
								styles.placeMediaPillContainer,
								{ marginBottom: isExpanded ? 10 : 17.5 },
								{ height: isExpanded ? 32.5 : 25 },
								{ backgroundColor: isHighlighted ? '#D6E5D6' : '#ECF3EC' },
							]}
						>
							<View style={{ width: '55%' }}>
								<Text numberOfLines={1} style={styles.placeNameText}>
									{place.name}
								</Text>
								<Text
									style={styles.placeDescriptionText}
									numberOfLines={isExpanded ? 3 : 2}
								>
									{place.description}
								</Text>
							</View>
							<View
								style={{
									width: '45%',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									paddingLeft: 10,
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<TouchableOpacity
										onPress={async () => {
											const result = await getApps({
												latitude: place.address?.coordinates.lat!,
												longitude: place.address?.coordinates.lng!,
												title: place.name,
												googleForceLatLon: false,
												alwaysIncludeGoogle: true,
												appsWhiteList: ['google-maps', 'apple-maps', 'waze'],
											});
											showActionSheetWithOptions(
												{
													options: [
														...result.map((app) => app.name),
														t('mapScreen.cancel'),
													],
													textStyle: { fontFamily: 'Montserrat-Regular' },
													cancelButtonIndex: result.length,
													icons: [
														...result.map((app) => (
															<Image
																source={app.icon}
																style={{ width: 24, height: 24 }}
															/>
														)),
														require('@/assets/images/error.png'),
													],
												},
												(buttonIndex) => {
													buttonIndex !== undefined &&
														result[buttonIndex]?.open();
												},
											);
										}}
									>
										<View
											style={{
												width: 24,
												height: 24,
												marginRight: 10,
												justifyContent: 'flex-end',
												alignItems: 'center',
											}}
										>
											<View
												style={{
													width: 24,
													height: 24,
													backgroundColor: '#3F713B',
													alignItems: 'center',
													justifyContent: 'center',
													borderRadius: 24,
												}}
											>
												<Image
													source={require('@/assets/images/place_detail_direction_white.png')}
													style={styles.directionIcon}
													resizeMode="contain"
												/>
											</View>
										</View>
									</TouchableOpacity>
									<View>
										<Image
											source={ImportanceIcon(place.importance)}
											style={styles.importanceIcon}
											resizeMode="contain"
										/>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'flex-end',
										paddingLeft: 10,
									}}
								>
									<Text style={styles.audiosNumberText} numberOfLines={1}>
										{`${medias?.length} ${
											medias.length > 1
												? t('routes.resources')
												: t('routes.resource')
										}`}
									</Text>
									<Image
										source={
											isExpanded
												? require('@/assets/images/route_detail_contract_place.png')
												: require('@/assets/images/route_detail_expand_place.png')
										}
										style={{ height: 6, width: 10.5, marginHorizontal: 10 }}
										resizeMode="contain"
									/>
								</View>
							</View>
						</View>
					</TouchableOpacity>
					{isExpanded && (
						<View style={{ flex: 1 }}>
							<View
								style={{
									borderWidth: 0.5,
									borderColor: '#BDBDBD',
									borderRadius: 0,
									marginBottom: 10,
								}}
							/>
							<View
								style={[
									styles.placeMediaContainer,
									{ backgroundColor: isHighlighted ? '#D6E5D6' : '#ECF3EC' },
								]}
							>
								<View style={styles.placeMediaIntroContainer}>
									<Text style={styles.placeMediaIntroText}>
										{t('placeDetailExpanded.mediaIntro')}
									</Text>
								</View>
								<ScrollView
									nestedScrollEnabled={true}
									style={{ width: '100%', marginTop: 8 }}
									contentContainerStyle={{ flexGrow: 1 }}
								>
									{medias?.map((media: IMedia, i: number) => (
										<RoutePlaceMediaPill
											key={i}
											index={i}
											media={media}
											mediasOfStop={medias}
											place={place}
											style={
												i === 0
													? {
															paddingTop: -8,
													  }
													: {}
											}
										/>
									))}
								</ScrollView>
							</View>
						</View>
					)}
				</View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	placeMediaPillAnimated: {
		borderRadius: 12,
		backgroundColor: '#ECF3EC',
		marginVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#C0DCBE',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 4,
		elevation: 5,
	},
	placeMediaPillContainer: {
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 17.5,
		paddingHorizontal: 8,
	},
	placeNameText: {
		fontSize: 12,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
	},
	placeDescriptionText: {
		fontSize: 8,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
	},
	directionIcon: { width: 14, height: 14 },
	importanceIcon: { width: 24, height: 30 },
	audiosNumberText: {
		fontSize: 10,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
	},
	placeMediaContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#ECF3EC',
		alignItems: 'center',
		justifyContent: 'center',
	},
	placeMediaIntroContainer: {
		alignSelf: 'flex-start',
		paddingHorizontal: 8,
	},
	placeMediaIntroText: {
		color: '#3F713B',
		fontSize: 8,
		fontFamily: 'Montserrat-SemiBold',
	},
});
