import React from 'react';
import Marker from '@/components/map/crossPlatformComponents/Marker';
import { View } from 'react-native';
import { useMainStore } from '@/zustand/MainStore';

export default function CurrentPositionMarker() {
	const currentUserLocation = useMainStore(
		(state) => state.main.currentUserLocation,
	);

	if (!currentUserLocation) {
		return null;
	}
	return (
		<Marker
			id={'center'}
			key={'center'}
			coordinate={{
				latitude: currentUserLocation[1],
				longitude: currentUserLocation[0],
			}}
		>
			<View
				style={{
					backgroundColor: 'rgba(114,154,255,0.2)',
					width: 30,
					height: 30,
					borderRadius: 15,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<View
					style={{
						backgroundColor: 'white',
						width: 16,
						height: 16,
						borderRadius: 9,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<View
						style={{
							backgroundColor: '#2F69FF',
							width: 13,
							height: 13,
							borderRadius: 7.5,
						}}
					/>
				</View>
			</View>
		</Marker>
	);
}
