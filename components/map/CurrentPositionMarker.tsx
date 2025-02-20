import React from 'react';
import Marker from '@/components/map/crossPlatformComponents/Marker';
import { View } from 'react-native';
import { useLocationStore } from '@/zustand/LocationStore';

export default function CurrentPositionMarker() {
	const coords = useLocationStore((state) => state.coords);

	return (
		coords &&
		coords.latitude &&
		coords.longitude && (
			<Marker
				id={'center'}
				key={'center'}
				coordinate={{
					latitude: coords.latitude,
					longitude: coords.longitude,
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
		)
	);
}
