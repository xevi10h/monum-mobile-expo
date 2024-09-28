import {
	Dimensions,
	Image,
	ImageSourcePropType,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import IMedia from '@/shared/interfaces/IMedia';
import MediaOfPlacePill from './MediaOfPlacePill';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { PaginationItem } from '@/components/media/PaginationItem';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useTranslation } from '@/hooks/useTranslation';
import { ScrollView } from 'react-native-gesture-handler';
import { getApps } from 'react-native-map-link';

const BORDER_RADIUS = 24;

interface MapPlaceDetailExpandedProps {
	importanceIcon: ImageSourcePropType;
	closePlaceDetail: () => void;
}

export default function MapPlaceDetailExpanded({
	importanceIcon,
	closePlaceDetail,
}: MapPlaceDetailExpandedProps) {
	const { showActionSheetWithOptions } = useActionSheet();
	const { t } = useTranslation();
	const place = useTabMapStore((state) => state.tabMap.place);
	const mediasOfPlace = useTabMapStore((state) => state.tabMap.mediasOfPlace);
	const progressValue = useSharedValue<number>(0);
	const imagesUrl = place?.imagesUrl || [];
	const width = Dimensions.get('window').width;
	const heightImage = 200;
	if (!place) {
		return null;
	}

	return (
		<View style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
			<View style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
				<ScrollView
					style={styles.container}
					showsVerticalScrollIndicator={false}
					scrollEventThrottle={16}
					bounces={false}
					nestedScrollEnabled
				>
					<View
						style={{
							width: '100%',
							height: '150%',
							backgroundColor: 'transparent',
							borderTopLeftRadius: 24,
							borderTopRightRadius: 24,
						}}
					>
						<View
							style={{
								height: heightImage,
								width: '100%',
								backgroundColor: 'transparent',
								borderTopLeftRadius: 24,
								borderTopRightRadius: 24,
							}}
						>
							<Carousel
								loop
								style={{
									borderTopLeftRadius: BORDER_RADIUS,
									borderTopRightRadius: BORDER_RADIUS,
									height: 200,
								}}
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
									top: 200 - 20,
									flexDirection: 'row',
									justifyContent: 'space-between',
									width:
										imagesUrl.length * 20 <= 100 ? imagesUrl.length * 20 : 100,
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

						<View style={styles.infoContainer}>
							<View style={styles.basicInfoConatiner}>
								<View style={{ maxWidth: '70%' }}>
									<Text numberOfLines={2} style={styles.placeName}>
										{place?.name}
									</Text>
									<Text
										style={styles.placeAddress}
									>{`${place?.address.city}, ${place?.address.country}`}</Text>
									<View style={styles.createdByContainer}>
										<Text numberOfLines={2} style={styles.createdByText}>{`${t(
											'mapScreen.createdBy',
										)}: ${place?.createdBy.username}`}</Text>
										{place?.createdBy?.photo && (
											<Image
												style={styles.createdByIcon}
												resizeMode="contain"
												source={{ uri: place?.createdBy.photo }}
											/>
										)}
									</View>
								</View>
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
												width: 36,
												height: 36,
												marginRight: 10,
												justifyContent: 'flex-end',
												alignItems: 'center',
											}}
										>
											<View
												style={{
													width: 36,
													height: 36,
													backgroundColor: '#3F713B',
													alignItems: 'center',
													justifyContent: 'center',
													borderRadius: 18,
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
									<View
										style={{
											width: 36,
											height: 43,
										}}
									>
										<Image
											source={importanceIcon}
											style={styles.importanceIcon}
											resizeMode="contain"
										/>
									</View>
								</View>
							</View>
							<View style={styles.descriptionContainer}>
								<Text style={styles.descriptionText}>{place?.description}</Text>
							</View>
						</View>
						<View style={styles.placeMediaContainer}>
							<View style={styles.placeMediaIntroContainer}>
								<Text style={styles.placeMediaIntroText}>
									{t('placeDetailExpanded.mediaIntro')}
								</Text>
							</View>
							<View style={{ width: '100%', height: '100%' }}>
								{mediasOfPlace?.map((media: IMedia, i: number) => (
									<MediaOfPlacePill key={i} index={i} media={media} />
								))}
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
			<Pressable style={styles.arrowContainer} onPress={closePlaceDetail}>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
					colors={['rgba(3, 32, 0, 1)', 'rgba(3, 32, 0, 0)']}
					style={styles.linearGradient}
				/>
				<Image
					source={require('@/assets/images/place_detail_arrow_bottom_white.png')}
					style={styles.arrowIcon}
					resizeMode="contain"
				/>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%',
		backgroundColor: '#ECF3EC',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		top: Platform.OS === 'ios' ? 0 : 0,
	},
	imageContainer: {
		height: 200,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	image: {
		width: '100%',
		height: '100%',
		borderTopLeftRadius: BORDER_RADIUS,
		borderTopRightRadius: BORDER_RADIUS,
	},
	arrowContainer: {
		top: Platform.OS === 'ios' ? 0 : 0,
		position: 'absolute',
		width: '100%',
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderTopLeftRadius: BORDER_RADIUS,
		borderTopRightRadius: BORDER_RADIUS,
	},
	linearGradient: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderTopLeftRadius: BORDER_RADIUS,
		borderTopRightRadius: BORDER_RADIUS,
	},
	arrowIcon: {
		height: 30,
		width: 30,
	},
	infoContainer: {
		backgroundColor: 'white',
		paddingHorizontal: 15,
	},
	basicInfoConatiner: {
		paddingVertical: 15,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	placeName: {
		fontSize: 14,
		color: '#032000',
		fontFamily: 'Montserrat-SemiBold',
	},
	placeAddress: {
		fontSize: 14,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
		paddingVertical: 5,
	},
	directionIcon: { width: 22, height: 22 },
	importanceIcon: { width: 36, height: 43 },
	descriptionContainer: { paddingBottom: 20 },
	descriptionText: {
		color: '#032000',
		textAlign: 'justify',
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
	},
	placeMediaContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#ECF3EC',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20,
	},
	placeMediaIntroContainer: {
		paddingVertical: 10,
		alignSelf: 'flex-start',
		paddingHorizontal: 15,
	},
	placeMediaIntroText: {
		color: '#3F713B',
		fontSize: 12,
		fontFamily: 'Montserrat-SemiBold',
	},
	createdByText: {
		fontSize: 14,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
	},
	createdByIcon: {
		width: 16,
		height: 16,
		borderRadius: 20,
		marginLeft: 5,
		borderWidth: 1,
		borderColor: '#3F713B',
	},
	createdByContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 16,
	},
});
