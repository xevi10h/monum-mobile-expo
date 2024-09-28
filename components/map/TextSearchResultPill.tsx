import { Text, TouchableOpacity, View } from 'react-native';
import { ISearchResult } from '@/shared/interfaces/ISearchResult';
import { Image } from 'react-native';
import { useTabMapStore } from '@/zustand/TabMapStore';
import MapServices from '@/services/map/MapServices';
import { router } from 'expo-router';

interface TextSearchMapResultPillProps {
	searcherResult: ISearchResult;
	navigation: any;
}

export default function TextSearchMapResultPill({
	searcherResult,
	navigation,
}: TextSearchMapResultPillProps) {
	const setCamera = useTabMapStore((state) => state.setCamera);
	const setPlace = useTabMapStore((state) => state.setPlace);
	const setShowPlaceDetailExpanded = useTabMapStore(
		(state) => state.setShowPlaceDetailExpanded,
	);
	const setTextSearch = useTabMapStore((state) => state.setTextSearch);
	const setMarkerSelected = useTabMapStore((state) => state.setMarkerSelected);
	const setMediasOfPlace = useTabMapStore((state) => state.setMediasOfPlace);
	const setTextSearchIsLoading = useTabMapStore(
		(state) => state.setTextSearchIsLoading,
	);

	const distanceToText = () => {
		if (searcherResult.distance < 1000) {
			return `${searcherResult.distance.toFixed(1).replace('.', ',')} m`;
		}
		const distanceKm = searcherResult.distance / 1000;
		let distanceKmString =
			distanceKm > 100 ? distanceKm.toFixed(0) : distanceKm.toFixed(1);
		distanceKmString = distanceKmString.replace('.', ',');
		return `${distanceKmString} km`;
	};
	return (
		<TouchableOpacity
			style={{ flex: 1 }}
			onPress={async () => {
				setTextSearch(searcherResult?.name);
				router.back();
				if (searcherResult.type === 'place') {
					setTextSearchIsLoading(true);
					const placeData = await MapServices.getPlaceInfo(
						searcherResult.id,
						'mapTextSearch',
					);
					const mediasFetched = await MapServices.getPlaceMedia(
						searcherResult.id,
					);
					setTextSearchIsLoading(false);
					setPlace(placeData);
					setMarkerSelected(searcherResult.id);
					setMediasOfPlace(mediasFetched);
					setShowPlaceDetailExpanded(false);
				} else {
					setTextSearchIsLoading(true);
					setPlace(null);
					setMarkerSelected(null);
					setMediasOfPlace(undefined);
					setShowPlaceDetailExpanded(false);
					setCamera({
						zoomLevel: 10,
						pitch: 0,
						centerCoordinate: [
							searcherResult.coordinates.lng,
							searcherResult.coordinates.lat,
						],
						animationDuration: 2000,
					});
					setTextSearchIsLoading(false);
				}
			}}
		>
			<View
				style={{
					borderColor: 'rgba(0,0,0,0.2)',
					height: 80,
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 5,
					paddingHorizontal: 15,
					paddingBottom: 5,
					borderBottomWidth: 1,
				}}
			>
				<View
					style={{
						height: '100%',
						alignItems: 'center',
						justifyContent: 'center',
						width: 25,
					}}
				>
					<Image
						source={
							searcherResult.type === 'place'
								? searcherResult?.importance === 1
									? require(`@/assets/images/place_pre_detail_importance_1.png`)
									: searcherResult?.importance === 2
									? require(`@/assets/images/place_pre_detail_importance_2.png`)
									: searcherResult?.importance === 3
									? require(`@/assets/images/place_pre_detail_importance_3.png`)
									: require(`@/assets/images/place_pre_detail_importance_1.png`)
								: searcherResult.hasMonums
								? require('@/assets/images/search_result_city_has_monums.png')
								: require('@/assets/images/search_result_city_not_has_monums.png')
						}
						style={{
							width: 24,
							height: 24,
						}}
						resizeMode="contain"
					/>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 3,
						}}
					>
						<Text
							style={{
								fontFamily: 'Montserrat-Regular',
								fontSize: 6,
								color: '#032000',
							}}
						>
							{distanceToText()}
						</Text>
					</View>
				</View>
				<View
					style={{
						width: '100%',
						justifyContent: 'center',
						height: '100%',
						paddingHorizontal: 10,
					}}
				>
					<Text
						style={{
							fontFamily: 'Montserrat-Regular',
							fontSize: 16,
							color: '#032000',
						}}
						numberOfLines={1}
					>
						{searcherResult?.name}
					</Text>
					<Text
						style={{
							fontFamily: 'Montserrat-Regular',
							fontSize: 14,
							color: '#3F713B',
						}}
						numberOfLines={1}
					>
						{searcherResult.type === 'place'
							? `${searcherResult?.city}, ${searcherResult?.country}`
							: `${searcherResult?.region}, ${searcherResult?.country}`}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
