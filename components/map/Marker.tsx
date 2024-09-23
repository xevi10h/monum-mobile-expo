import { Marker } from 'react-native-maps';
import { useState } from 'react';
import { useEffect } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { IMarker } from '@/shared/interfaces/IMarker';
import { useTabMapStore } from '@/zustand/TabMapStore';
import MapServices from '@/services/map/MapServices';
import { useUserStore } from '@/zustand/UserStore';

export function MarkerComponent({ id, coordinates, importance }: IMarker) {
	const setMarkerSelected = useTabMapStore((state) => state.setMarkerSelected);
	const language = useUserStore((state) => state.user.language);
	const setPlace = useTabMapStore((state) => state.setPlace);
	const setMediasOfPlace = useTabMapStore((state) => state.setMediasOfPlace);
	const markerSelected = useTabMapStore((state) => state.tabMap.markerSelected);
	const lastMarkerSelected = useTabMapStore(
		(state) => state.tabMap.lastMarkerSelected,
	);
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
		if (markerSelected === id || lastMarkerSelected === id) {
			chooseIcon();
		}
	}, [markerSelected, lastMarkerSelected]);

	useEffect(() => {
		chooseIcon();
	}, []);

	return (
		<Marker
			id={id}
			key={id}
			coordinate={{
				latitude: coordinates[1],
				longitude: coordinates[0],
			}}
			onPress={async () => {
				const placeData = await MapServices.getPlaceInfo(id, 'map', language);
				console.log(placeData);
				setPlace(placeData);
				setMarkerSelected(id);
				const mediasFetched = await MapServices.getPlaceMedia(id, language);
				setMediasOfPlace(mediasFetched);
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
