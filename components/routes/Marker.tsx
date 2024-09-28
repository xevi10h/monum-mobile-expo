import { Marker } from 'react-native-maps';
import { useState } from 'react';
import React, { useEffect } from 'react';
import { Image, Pressable, TouchableOpacity } from 'react-native';

import { IMarker } from '@/shared/interfaces/IMarker';
import { useTabRouteStore } from '@/zustand/TabRouteStore';

export function MarkerComponent({ id, coordinates, importance }: IMarker) {
	const setMarkerSelected = useTabRouteStore(
		(state) => state.setMarkerSelected,
	);
	const markerSelected = useTabRouteStore((state) => state.markerSelected);
	const [icon, setIcon] = useState(
		require('@/assets/images/map_marker_importance_1.png'),
	);
	const dimensions = 50;
	const chooseIcon = () => {
		const selected = markerSelected === id;
		switch (importance) {
			case 1:
				setIcon(
					selected
						? require('@/assets/images/map_marker_importance_1_selected.png')
						: require('@/assets/images/map_marker_importance_1.png'),
				);
				break;
			case 2:
				setIcon(
					selected
						? require('@/assets/images/map_marker_importance_2_selected.png')
						: require('@/assets/images/map_marker_importance_2.png'),
				);
				break;
			case 3:
				setIcon(
					selected
						? require('@/assets/images/map_marker_importance_3_selected.png')
						: require('@/assets/images/map_marker_importance_3.png'),
				);
				break;
			default:
				setIcon(
					selected
						? require('@/assets/images/map_marker_importance_1_selected.png')
						: require('@/assets/images/map_marker_importance_1.png'),
				);
				break;
		}
	};

	useEffect(() => {
		chooseIcon();
	}, [markerSelected]);

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
		>
			<Image
				source={icon}
				style={{ width: dimensions, height: dimensions }}
				resizeMode={'contain'}
			/>
		</Marker>
	);
}
