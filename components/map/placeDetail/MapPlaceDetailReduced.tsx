import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTabMapStore } from '@/zustand/TabMapStore';
import { useMainStore } from '@/zustand/MainStore';
import { useTranslation } from '@/hooks/useTranslation';

interface MapPlaceDetailReducedProps {
	importanceIcon: ImageSourcePropType;
}

export default function MapPlaceDetailReduced({
	importanceIcon,
}: MapPlaceDetailReducedProps) {
	const { t } = useTranslation();
	const setShowPlaceDetailExpanded = useTabMapStore(
		(state) => state.setShowPlaceDetailExpanded,
	);
	const place = useTabMapStore((state) => state.tabMap.place);
	return (
		<View style={styles.container}>
			<LinearGradient
				start={{ x: 0, y: 1 }}
				end={{ x: 0, y: 0 }}
				colors={['#0002', '#0000']}
				style={[styles.linearGradient, { height: '100%' }]}
			/>
			<TouchableWithoutFeedback
				onPress={() => {
					setShowPlaceDetailExpanded(true);
				}}
			>
				<View>
					<View style={styles.arrowContainer}>
						<Image
							source={require('@/assets/images/place_pre_detail_arrow_top.png')}
							style={[styles.arrowIcon]}
							resizeMode="cover"
						/>
					</View>
					<View style={styles.informationContainer}>
						<View style={styles.imageContainer}>
							{place?.imagesUrl && (
								<Image
									source={{
										uri: Array.isArray(place.imagesUrl)
											? `${place.imagesUrl[0]}`
											: '',
									}}
									style={styles.image}
									resizeMode="cover"
								/>
							)}
						</View>
						<View style={styles.textInformationContainer}>
							<Text numberOfLines={1} style={styles.textPlaceName}>
								{place?.name}
							</Text>
							<Text
								numberOfLines={1}
								style={styles.textPlaceAddress}
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
						<View style={styles.importanceIconContainer}>
							<Image
								source={importanceIcon}
								resizeMode="contain"
								style={styles.importanceIconImage}
							/>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%',
		zIndex: 10,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	arrowContainer: {
		width: '100%',
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	arrowIcon: {
		height: 24,
		width: 24,
	},
	informationContainer: {
		width: '100%',
		height: 70,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	imageContainer: {
		flex: 2.5,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		paddingHorizontal: 12,
		width: '100%',
		height: '100%',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	textInformationContainer: {
		flex: 4,
		justifyContent: 'space-between',
		height: '100%',
	},
	textPlaceName: {
		fontSize: 14,
		color: '#032000',
		fontFamily: 'Montserrat-SemiBold',
	},
	textPlaceAddress: {
		fontSize: 14,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
	},
	createdByContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 16,
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
	importanceIconContainer: { flex: 1, marginHorizontal: '6%' },
	importanceIconImage: { width: 40, height: 40 },
	linearGradient: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
});
