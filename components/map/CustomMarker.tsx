import { useMemo } from 'react';
import Marker from '@/components/map/crossPlatformComponents/Marker';
import { Image } from 'react-native';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { router } from 'expo-router';
import { IMarker } from '@/shared/interfaces/IMarker';

export const MarkerComponent = ({ id, coordinates, importance }: IMarker) => {
	const markerSelected = useTabMapStore((state) => state.tabMap.markerSelected);
	const lastMarkerSelected = useTabMapStore(
		(state) => state.tabMap.lastMarkerSelected,
	);

	const icon = useMemo(() => {
		const isSelected = markerSelected === id;
		switch (importance) {
			case 1:
				return isSelected
					? require('@/assets/images/map_marker_importance_1_selected.png')
					: require('@/assets/images/map_marker_importance_1.png');
			case 2:
				return isSelected
					? require('@/assets/images/map_marker_importance_2_selected.png')
					: require('@/assets/images/map_marker_importance_2.png');
			case 3:
				return isSelected
					? require('@/assets/images/map_marker_importance_3_selected.png')
					: require('@/assets/images/map_marker_importance_3.png');
			default:
				return isSelected
					? require('@/assets/images/map_marker_importance_1_selected.png')
					: require('@/assets/images/map_marker_importance_1.png');
		}
	}, [markerSelected, lastMarkerSelected, importance, id]);

	const tracksViewChanges = useMemo(() => {
		return (
			markerSelected === id ||
			(markerSelected !== null && lastMarkerSelected === id)
		);
	}, [markerSelected, lastMarkerSelected, id]);

	return (
		<Marker
			key={id}
			coordinate={{
				latitude: coordinates[1],
				longitude: coordinates[0],
			}}
			anchor={{ x: 0.5, y: 0.5 }}
			onPress={() => {
				router.push({
					pathname: `/(main)/place`,
					params: { placeId: id },
				});
			}}
			tracksViewChanges={tracksViewChanges}
		>
			<Image
				source={icon}
				style={{ width: 50, height: 50 }}
				resizeMode={'contain'}
			/>
		</Marker>
	);
};
