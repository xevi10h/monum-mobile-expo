import Marker from '@/components/map/crossPlatformComponents/Marker';
import React, { useMemo } from 'react';
import { Image } from 'react-native';

import { IMarker } from '@/shared/interfaces/IMarker';
import { useTabRouteStore } from '@/zustand/TabRouteStore';

export function MarkerComponent({ id, coordinates, importance }: IMarker) {
	const setMarkerSelected = useTabRouteStore(
		(state) => state.setMarkerSelected,
	);
	const markerSelected = useTabRouteStore((state) => state.markerSelected);

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
	}, [markerSelected, importance, id]);

	const tracksViewChanges = useMemo(() => {
		return markerSelected === id;
	}, [markerSelected, id]);

	return (
		<Marker
			id={id}
			key={id}
			coordinate={{
				latitude: coordinates[1],
				longitude: coordinates[0],
			}}
			onPress={() => {
				setMarkerSelected(id);
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
}
